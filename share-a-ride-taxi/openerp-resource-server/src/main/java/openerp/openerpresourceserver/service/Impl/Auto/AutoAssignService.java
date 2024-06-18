package openerp.openerpresourceserver.service.Impl.Auto;

import com.graphhopper.ResponsePath;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.*;
import openerp.openerpresourceserver.enums.RequestStatus;
import openerp.openerpresourceserver.enums.RouteStatus;
import openerp.openerpresourceserver.service.Interface.*;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AutoAssignService {

    private final ParcelRequestService parcelRequestService;
    private final WarehouseService warehouseService;
    private final GraphHopperCalculator graphHopperCalculator;

    private List<ParcelRequest> parcelPassengers;
    private List<Warehouse> warehouses;

    // Driver
    private final DriverService driverService;

    // PickUp
    private final RoutePickupService routePickupService;
    private final RoutePickupDetailService routePickupDetailService;
    private final Vector<Pair<Warehouse, ParcelRequest>> vectorPickUp = new Vector<>();
    private final Vector<RoutePickupDetail> routePickupDetailVector = new Vector<>();
    private final Vector<RoutePickup> vectorRoutePickup = new Vector<>();

    // DropOff
    private final RouteDropoffService routeDropoffService;
    private final RouteDropoffDetailService routeDropoffDetailService;
    private final Vector<Pair<Warehouse, ParcelRequest>> vectorDropoff = new Vector<>();
    private final Vector<RouteDropoffDetail> routeDropoffDetailVector = new Vector<>();
    private final Vector<RouteDropoff> vectorRouteDropoff = new Vector<>();

    // Warehouse
    private final RouteWarehouseService routeWarehouseService;
    private final RouteWarehouseDetailService routeWarehouseDetailService;
    private final HashMap<String, Set<String>> pickUpWareHouseToDropOffWareHouse = new HashMap<>();
    private final Vector<RouteWarehouse> routeWarehouseVector = new Vector<>();
    private final HashMap<RouteWarehouse, Vector<RouteWarehouseDetail>> routeWarehouseToDetailVector = new HashMap<>();

    public String autoAssign(String day) throws Exception {
        // Retrieve all parcel requests and warehouses
        parcelPassengers = parcelRequestService.getAllParcelRequests();
        warehouses = warehouseService.getAllWarehouses();

        // Perform clustering for pick up, drop off, and warehouse routes
        clusteringPickUp(day);
        clusteringDropoff(day);
        clusteringWareHouse(day);

        // Collect details of pick up and drop off routes for reporting
        String pickupDetails = routePickupDetailVector.stream()
                .map(routePickupDetail -> "RouteId : " + routePickupDetail.getRouteId() + " RequestId: " + routePickupDetail.getRequestId() + " SeqIndex : " + routePickupDetail.getSeqIndex())
                .collect(Collectors.joining("\n"));

        String dropoffDetails = routeDropoffDetailVector.stream()
                .map(routeDropoffDetail -> "RouteId : " + routeDropoffDetail.getRouteId() + " RequestId: " + routeDropoffDetail.getRequestId() + " SeqIndex : " + routeDropoffDetail.getSeqIndex())
                .collect(Collectors.joining("\n"));

        // Collect details of warehouse routes for reporting
        StringBuilder result = new StringBuilder();
        for (Map.Entry<String, Set<String>> entry : pickUpWareHouseToDropOffWareHouse.entrySet()) {
            String wareHouseId = entry.getKey();
            Set<String> dropOffWareHouseVector = entry.getValue();
            result.append("Warehouse ID: ").append(wareHouseId).append("\n");
            result.append("Dropoff Warehouses:\n");
            for (String dropOffWareHouseId : dropOffWareHouseVector) {
                result.append("- ").append(dropOffWareHouseId).append("\n");
            }
        }

        // Combine all details for the final report
        String combinedDetails = pickupDetails
                .concat("\n-------------------\n")
                .concat(result.toString())
                .concat("-------------------\n")
                .concat(dropoffDetails);

        // Clear data structures for the next execution
        clearDataStructures();
        return combinedDetails;
    }

    private void clusteringPickUp(String day) throws Exception {
        // Clustering pick up requests to nearest warehouse
        for (ParcelRequest parcelRequest : parcelPassengers) {
            Coordinate parcelRequestPickUpLocation = new Coordinate(parcelRequest.getPickupLatitude(), parcelRequest.getPickupLongitude());
            Warehouse pickUpWarehouse = new Warehouse();
            double distancePickUp = Double.MAX_VALUE;
            for (Warehouse warehouse : warehouses) {
                Coordinate wareHouseLocation = new Coordinate(warehouse.getLat(), warehouse.getLon());
                ResponsePath pickUpWarehousePath = graphHopperCalculator.calculate(parcelRequestPickUpLocation, wareHouseLocation);
                if (pickUpWarehousePath.getDistance() < distancePickUp) {
                    distancePickUp = pickUpWarehousePath.getDistance();
                    pickUpWarehouse = warehouse;
                }
            }
            vectorPickUp.add(Pair.of(pickUpWarehouse, parcelRequest));
        }
        vectorPickUp.sort(Comparator.comparing(pair -> pair.getFirst().getWarehouseId()));

        Set<String> pickUpWareHouseName = new HashSet<>();

        for (Pair<Warehouse, ParcelRequest> pair : vectorPickUp) {
            pickUpWareHouseName.add(pair.getFirst().getWarehouseId());
        }

        // Assign drivers to pick up routes
        for (String wareHouseId : pickUpWareHouseName) {
            List<Driver> drivers = driverService.getDriversByWarehouseId(wareHouseId);
            Driver driver = drivers.get(0);
            RoutePickup routePickup = RoutePickup.builder()
                    .wareHouseId(wareHouseId)
                    .id(wareHouseId + "_pickup_route_" + day)
                    .routeStatusId(RouteStatus.NOT_READY.ordinal())
                    .driverId(driver.getUserId())
                    .build();
            vectorRoutePickup.add(routePickup);
            routePickupService.save(routePickup);
        }

        // Create pick up route details and save them
        HashMap<String, Integer> warehousePickUpHouseIdToLength = new HashMap<>();
        for (int i = 0; i < vectorPickUp.size(); i++) {
            Pair<Warehouse, ParcelRequest> pair = vectorPickUp.get(i);
            Warehouse warehousePickUp = pair.getFirst();
            ParcelRequest parcelRequest = pair.getSecond();
            int currentlength = warehousePickUpHouseIdToLength.get(warehousePickUp.getWarehouseId()) == null ? 0 : warehousePickUpHouseIdToLength.get(warehousePickUp.getWarehouseId());
            currentlength = currentlength + 1;
            warehousePickUpHouseIdToLength.put(warehousePickUp.getWarehouseId(), currentlength);

            RoutePickupDetail routePickupDetail = RoutePickupDetail.builder()
                    .routeId(warehousePickUp.getWarehouseId() + "_pickup_route_" + day)
                    .requestId(parcelRequest.getRequestId())
                    .seqIndex(currentlength)
                    .build();
            parcelRequest.setStatusId(RequestStatus.DRIVER_ASSIGNED.ordinal());

            parcelRequestService.createParcelRequest(parcelRequest);
            routePickupDetailVector.add(routePickupDetail);
            routePickupDetailService.save(routePickupDetail);
        }
        tspPickUpRoute();
    }

    private void clusteringDropoff(String day) throws Exception {
        // Clustering drop off requests to nearest warehouse
        for (ParcelRequest parcelRequest : parcelPassengers) {
            Coordinate parcelRequestDropOffLocation = new Coordinate(parcelRequest.getDropoffLatitude(), parcelRequest.getDropoffLongitude());
            Warehouse dropOffWarehouse = new Warehouse();
            double distanceDropOff = Double.MAX_VALUE;
            for (Warehouse warehouse : warehouses) {
                Coordinate wareHouseLocation = new Coordinate(warehouse.getLat(), warehouse.getLon());
                ResponsePath dropOffWarehousePath = graphHopperCalculator.calculate(parcelRequestDropOffLocation, wareHouseLocation);
                if (dropOffWarehousePath.getDistance() < distanceDropOff) {
                    distanceDropOff = dropOffWarehousePath.getDistance();
                    dropOffWarehouse = warehouse;
                }
            }
            vectorDropoff.add(Pair.of(dropOffWarehouse, parcelRequest));
        }
        vectorDropoff.sort(Comparator.comparing(pair -> pair.getFirst().getWarehouseId()));

        Set<String> dropOffWareHouseName = new HashSet<>();

        for (Pair<Warehouse, ParcelRequest> pair : vectorDropoff) {
            dropOffWareHouseName.add(pair.getFirst().getWarehouseId());
        }

        // Assign drivers to drop off routes
        for (String wareHouseId : dropOffWareHouseName) {
            List<Driver> drivers = driverService.getDriversByWarehouseId(wareHouseId);
            Driver driver = drivers.get(0);
            RouteDropoff routeDropoff = RouteDropoff.builder()
                    .wareHouseId(wareHouseId)
                    .id(wareHouseId + "_dropoff_route_" + day)
                    .routeStatusId(RouteStatus.NOT_READY.ordinal())
                    .driverId(driver.getUserId())
                    .build();

            vectorRouteDropoff.add(routeDropoff);
            routeDropoffService.createRouteDropoff(routeDropoff);
        }

        // Create drop off route details and save them
        HashMap<String, Integer> wareDropOffHouseIdToLength = new HashMap<>();
        for (int i = 0; i < vectorDropoff.size(); i++) {
            Pair<Warehouse, ParcelRequest> pair = vectorDropoff.get(i);
            Warehouse warehouseDropOff = pair.getFirst();
            ParcelRequest parcelRequest = pair.getSecond();
            int currentlength = wareDropOffHouseIdToLength.get(warehouseDropOff.getWarehouseId()) == null ? 0 : wareDropOffHouseIdToLength.get(warehouseDropOff.getWarehouseId());
            currentlength = currentlength + 1;
            wareDropOffHouseIdToLength.put(warehouseDropOff.getWarehouseId(), currentlength);

            RouteDropoffDetail routePickupDetail = RouteDropoffDetail.builder()
                    .routeId(warehouseDropOff.getWarehouseId() + "_dropoff_route_" + day)
                    .requestId(parcelRequest.getRequestId())
                    .seqIndex(currentlength)
                    .build();

            parcelRequest.setStatusId(RequestStatus.DRIVER_ASSIGNED.ordinal());
            routeDropoffDetailVector.add(routePickupDetail);
            routeDropoffDetailService.createRouteDropoffDetail(routePickupDetail);
        }
    }

    private void clusteringWareHouse(String day) throws Exception {
        // Clustering warehouses for route optimization
        for (RoutePickup routePickup : vectorRoutePickup) {
            String wareHouseId = routePickup.getWareHouseId();

            if (pickUpWareHouseToDropOffWareHouse.get(routePickup.getWareHouseId()) == null) {
                pickUpWareHouseToDropOffWareHouse.put(wareHouseId, new HashSet<>());

                // Assign drivers to warehouse routes
                List<Driver> drivers = driverService.getDriversByWarehouseId(wareHouseId);
                Driver driver = drivers.get(0);
                RouteWarehouse routeWarehouse = RouteWarehouse.builder()
                        .startWarehouseId(wareHouseId)
                        .id(wareHouseId + "_route_warehouse_" + day)
                        .routeStatusId(RouteStatus.NOT_READY.ordinal())
                        .driverId(driver.getUserId())
                        .build();

                routeWarehouseService.createRoute(routeWarehouse);
            }
        }

        // Create warehouse route details
        HashMap<String, Integer> startWarehousHouseIdToLength = new HashMap<>();
        for (Map.Entry<String, Set<String>> entry : pickUpWareHouseToDropOffWareHouse.entrySet()) {
            String wareHouseId = entry.getKey();
            Set<String> dropOffWareHouseSet = entry.getValue();

            Vector<RoutePickupDetail> routePickUpDetailOfThisWareHouse = new Vector<>();
            Vector<RouteDropoffDetail> routeDropOffDetailFromThisWareHouse = new Vector<>();
            Vector<RoutePickup> routePickUpOfThisWareHouse = new Vector<>();

            // Find route pickups directed to this warehouse
            for (RoutePickup routePickup : vectorRoutePickup) {
                if (routePickup.getWareHouseId().equals(wareHouseId)) {
                    routePickUpOfThisWareHouse.add(routePickup);
                }
            }

            // Find route pickup details directed to this warehouse
            for (RoutePickup routePickup : routePickUpOfThisWareHouse) {
                for (RoutePickupDetail routePickupDetail : routePickupDetailVector) {
                    if (routePickupDetail.getRouteId().equals(routePickup.getId())) {
                        routePickUpDetailOfThisWareHouse.add(routePickupDetail);
                    }
                }
            }

            // Find route drop off details going out of this warehouse
            for (RoutePickupDetail routePickupDetail : routePickUpDetailOfThisWareHouse) {
                for (RouteDropoffDetail routeDropoffDetail : routeDropoffDetailVector) {
                    if (routeDropoffDetail.getRequestId() == routePickupDetail.getRequestId()) {
                        routeDropOffDetailFromThisWareHouse.add(routeDropoffDetail);
                    }
                }
            }

            // Find route drop offs going out of this warehouse
            for (RouteDropoff routeDropoff : vectorRouteDropoff) {
                for (RouteDropoffDetail routeDropoffDetail : routeDropOffDetailFromThisWareHouse) {
                    if (routeDropoffDetail.getRouteId().equals(routeDropoff.getId())) {
                        if (!dropOffWareHouseSet.contains(routeDropoff.getWareHouseId())) {
                            int currentlength = startWarehousHouseIdToLength.get(wareHouseId) == null ? 0 : startWarehousHouseIdToLength.get(wareHouseId);
                            startWarehousHouseIdToLength.put(wareHouseId, currentlength + 1);

                            // Save warehouse route details
                            RouteWarehouseDetail routeWarehouseDetail = RouteWarehouseDetail.builder()
                                    .warehouseId(routeDropoff.getWareHouseId())
                                    .seqIndex(currentlength + 1)
                                    .routeId(wareHouseId + "_route_warehouse_" + day)
                                    .build();
                            routeWarehouseDetailService.save(routeWarehouseDetail);
                        }
                        dropOffWareHouseSet.add(routeDropoff.getWareHouseId());
                    }
                }
            }
        }
        solveTSPWarehouseRoute(day);
    }

    private void tspPickUpRoute() throws Exception {
        for (RoutePickup routePickup : vectorRoutePickup) {
            // Lấy tất cả RoutePickupDetail cho routePickup hiện tại
            List<RoutePickupDetail> routePickupDetails = routePickupDetailVector.stream()
                    .filter(detail -> detail.getRouteId().equals(routePickup.getId()))
                    .collect(Collectors.toList());

            if (routePickupDetails.size() < 2) {
                continue; // Nếu ít hơn 2 điểm thì không cần tối ưu
            }

            // Lấy tọa độ của các điểm trong routePickupDetails
            List<Coordinate> coordinates = new ArrayList<>();
            for (RoutePickupDetail detail : routePickupDetails) {
                ParcelRequest parcelRequest = parcelPassengers.stream()
                        .filter(request -> request.getRequestId().equals(detail.getRequestId()))
                        .findFirst()
                        .orElseThrow(() -> new Exception("ParcelRequest not found"));
                coordinates.add(new Coordinate(parcelRequest.getPickupLatitude(), parcelRequest.getPickupLongitude()));
            }

            // Áp dụng thuật toán Nearest Neighbor để sắp xếp lại thứ tự các điểm
            List<Integer> optimizedOrder = solveTSPUsingNearestNeighbor(coordinates);

            // Cập nhật lại thứ tự các RoutePickupDetail theo kết quả tối ưu
            for (int i = 0; i < optimizedOrder.size(); i++) {
                routePickupDetails.get(optimizedOrder.get(i)).setSeqIndex(i + 1);
            }

            // Lưu lại các chi tiết đã cập nhật
            for (RoutePickupDetail detail : routePickupDetails) {
                routePickupDetailService.save(detail);
            }
        }
    }

    private void tspDropOffRoute(){
        // Placeholder for TSP algorithm for drop off routes
        for (RouteDropoff routeDropoff : vectorRouteDropoff){
            // Implement TSP algorithm here
        }
    }


    private void solveTSPWarehouseRoute(String day) throws Exception {
        for (RouteWarehouse routeWarehouse : routeWarehouseVector) {
            // Get all RouteWarehouseDetail for the current routeWarehouse
            List<RouteWarehouseDetail> routeWarehouseDetails = routeWarehouseToDetailVector.get(routeWarehouse);

            if (routeWarehouseDetails.size() < 2) {
                continue; // No need to optimize if less than 2 points
            }

            // Get coordinates of points in routeWarehouseDetails
            List<Coordinate> coordinates = new ArrayList<>();
            for (RouteWarehouseDetail detail : routeWarehouseDetails) {
                Warehouse warehouse = warehouses.stream()
                        .filter(w -> w.getWarehouseId().equals(detail.getWarehouseId()))
                        .findFirst()
                        .orElseThrow(() -> new Exception("Warehouse not found"));
                coordinates.add(new Coordinate(warehouse.getLat(), warehouse.getLon()));
            }

            // Apply TSP algorithm to re-order the points
            List<Integer> optimizedOrder = solveTSPUsingNearestNeighbor(coordinates);

            // Update the sequence index of RouteWarehouseDetail according to the optimized result
            for (int i = 0; i < optimizedOrder.size(); i++) {
                routeWarehouseDetails.get(optimizedOrder.get(i)).setSeqIndex(i + 1);
            }

            // Save the updated details
            for (RouteWarehouseDetail detail : routeWarehouseDetails) {
                routeWarehouseDetailService.save(detail);
            }
        }
    }

    private List<Integer> solveTSPUsingNearestNeighbor(List<Coordinate> coordinates) throws Exception {
        int n = coordinates.size();
        boolean[] visited = new boolean[n];
        List<Integer> path = new ArrayList<>();

        int current = 0;
        path.add(current);
        visited[current] = true;

        for (int i = 1; i < n; i++) {
            double minDistance = Double.MAX_VALUE;
            int next = -1;
            for (int j = 0; j < n; j++) {
                if (!visited[j]) {
                    double distance = calculateDistance(coordinates.get(current), coordinates.get(j));
                    if (distance < minDistance) {
                        minDistance = distance;
                        next = j;
                    }
                }
            }
            if (next != -1) {
                path.add(next);
                visited[next] = true;
                current = next;
            }
        }
        return path;
    }

    private double calculateDistance(Coordinate a, Coordinate b) throws Exception {
        ResponsePath path = graphHopperCalculator.calculate(a, b);
        return path.getDistance();
    }

    private void clearDataStructures() {
        // Clear all data structures for the next execution
        vectorPickUp.clear();
        routePickupDetailVector.clear();
        vectorRoutePickup.clear();
        vectorDropoff.clear();
        routeDropoffDetailVector.clear();
        vectorRouteDropoff.clear();
        pickUpWareHouseToDropOffWareHouse.clear();
    }
}
