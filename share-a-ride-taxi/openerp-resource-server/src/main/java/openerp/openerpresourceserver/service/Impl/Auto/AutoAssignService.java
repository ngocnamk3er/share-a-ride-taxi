package openerp.openerpresourceserver.service.Impl.Auto;

import com.graphhopper.ResponsePath;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.*;
import openerp.openerpresourceserver.enums.RouteStatus;
import openerp.openerpresourceserver.service.GraphHopperCalculator;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import openerp.openerpresourceserver.service.ParcelRequestService;
import openerp.openerpresourceserver.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.stereotype.Service;

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

    //PickUp
    private final Vector<Pair<Warehouse, ParcelRequest>> vectorPickUp = new Vector<>();
    private final Vector<RoutePickupDetail> routePickupDetailVector = new Vector<>();
    private final Vector<RoutePickup> vectorRoutePickup = new Vector<>();

    //DropOff
    private final Vector<Pair<Warehouse, ParcelRequest>> vectorDropoff = new Vector<>();
    private final Vector<RouteDropoffDetail> routeDropoffDetailVector = new Vector<>();
    private final Vector<RouteDropoff> vectorRouteDropoff = new Vector<>();

    public String autoAssign() throws Exception {
        parcelPassengers = parcelRequestService.getAllParcelRequests();
        warehouses = warehouseService.getAllWarehouses();

        clusteringPickUp();
        clusteringDropoff();

//        return routePickupDetailVector.stream()
//                .map(routePickupDetail -> "RouteId : " + routePickupDetail.getRouteId() + " RequestId: " + routePickupDetail.getRequestId() + " SedIndex : " + routePickupDetail.getSeqIndex())
//                .collect(Collectors.joining("\n"));

//        return routeDropoffDetailVector.stream()
//                .map(routeDropoffDetail -> "RouteId : " + routeDropoffDetail.getRouteId() + " RequestId: " + routeDropoffDetail.getRequestId() + " SedIndex : " + routeDropoffDetail.getSeqIndex())
//                .collect(Collectors.joining("\n"));


        String pickupDetails = routePickupDetailVector.stream()
                .map(routePickupDetail -> "RouteId : " + routePickupDetail.getRouteId() + " RequestId: " + routePickupDetail.getRequestId() + " SeqIndex : " + routePickupDetail.getSeqIndex())
                .collect(Collectors.joining("\n"));

        String dropoffDetails = routeDropoffDetailVector.stream()
                .map(routeDropoffDetail -> "RouteId : " + routeDropoffDetail.getRouteId() + " RequestId: " + routeDropoffDetail.getRequestId() + " SeqIndex : " + routeDropoffDetail.getSeqIndex())
                .collect(Collectors.joining("\n"));

// Nối hai kết quả lại
        String combinedDetails = pickupDetails.concat("\n").concat(dropoffDetails);

        return combinedDetails;

    }

    private void clusteringPickUp() throws Exception {
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

        Set<String> pickUpWareHouseName = new HashSet<>(); // Khởi tạo một Set rỗng để lưu trữ wareHouseId

        for (Pair<Warehouse, ParcelRequest> pair : vectorPickUp) {
            pickUpWareHouseName.add(pair.getFirst().getWarehouseId()); // Thêm wareHouseId vào Set
        }

        for (String wareHouseId : pickUpWareHouseName) {
            RoutePickup routePickup = RoutePickup.builder()
                    .wareHouseId(wareHouseId)
                    .id(wareHouseId + "_pickup_route")
                    .build();
            vectorRoutePickup.add(routePickup);
        }


        HashMap<String, Integer> warePickUpHouseIdToLength = new HashMap<>();
        for (int i = 0; i < vectorPickUp.size(); i++) {
            Pair<Warehouse, ParcelRequest> pair = vectorPickUp.get(i);
            Warehouse warehousePickUp = pair.getFirst();
            ParcelRequest parcelRequest = pair.getSecond();
            int currentlength = warePickUpHouseIdToLength.get(warehousePickUp.getWarehouseId()) == null ? 0 : warePickUpHouseIdToLength.get(warehousePickUp.getWarehouseId());
            currentlength = currentlength+1;
            warePickUpHouseIdToLength.put(warehousePickUp.getWarehouseId(), currentlength);
            RoutePickupDetail routePickupDetail = RoutePickupDetail.builder()
                    .routeId(warehousePickUp.getWarehouseId() + "_pickup_route")
                    .requestId(parcelRequest.getRequestId())
                    .seqIndex(currentlength)
                    .build();
            routePickupDetailVector.add(routePickupDetail);
        }
    }

    private void clusteringDropoff() throws Exception {
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

        Set<String> dropOffWareHouseName = new HashSet<>(); // Khởi tạo một Set rỗng để lưu trữ wareHouseId

        for (Pair<Warehouse, ParcelRequest> pair : vectorDropoff) {
            dropOffWareHouseName.add(pair.getFirst().getWarehouseId()); // Thêm wareHouseId vào Set
        }

        for (String wareHouseId : dropOffWareHouseName) {
            RouteDropoff routePickup = RouteDropoff.builder()
                    .wareHouseId(wareHouseId)
                    .id(wareHouseId + "_dropoff_route")
                    .build();
            vectorRouteDropoff.add(routePickup);
        }


        HashMap<String, Integer> wareDropOffHouseIdToLength = new HashMap<>();
        for (int i = 0; i < vectorDropoff.size(); i++) {
            Pair<Warehouse, ParcelRequest> pair = vectorDropoff.get(i);
            Warehouse warehouseDropOff = pair.getFirst();
            ParcelRequest parcelRequest = pair.getSecond();
            int currentlength = wareDropOffHouseIdToLength.get(warehouseDropOff.getWarehouseId()) == null ? 0 : wareDropOffHouseIdToLength.get(warehouseDropOff.getWarehouseId());
            currentlength = currentlength+1;
            wareDropOffHouseIdToLength.put(warehouseDropOff.getWarehouseId(), currentlength);
            RouteDropoffDetail routePickupDetail = RouteDropoffDetail.builder()
                    .routeId(warehouseDropOff.getWarehouseId() + "_dropoff_route")
                    .requestId(parcelRequest.getRequestId())
                    .seqIndex(currentlength)
                    .build();
            routeDropoffDetailVector.add(routePickupDetail);
        }
    }

    private void clusteringWareHouse(){

    }

}
