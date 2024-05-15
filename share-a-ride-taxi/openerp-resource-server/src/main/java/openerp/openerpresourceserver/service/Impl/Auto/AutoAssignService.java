package openerp.openerpresourceserver.service.Impl.Auto;

import com.graphhopper.ResponsePath;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.entity.RoutePickup;
import openerp.openerpresourceserver.entity.RoutePickupDetail;
import openerp.openerpresourceserver.entity.Warehouse;
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

    //PickUp
    private final Vector<Pair<Warehouse, ParcelRequest>> vectorPickUp = new Vector<>();
    private final Vector<RoutePickupDetail> routePickupDetailVector = new Vector<>();
    private final Vector<RoutePickup> vectorRoutePickup = new Vector<>();
    private List<ParcelRequest> parcelPassengers;
    private List<Warehouse> warehouses;

    //DropOff


    public String autoAssign() throws Exception {
        parcelPassengers = parcelRequestService.getAllParcelRequests();
        warehouses = warehouseService.getAllWarehouses();

        clusteringPickUp();

        return routePickupDetailVector.stream()
                .map(routePickupDetail -> "RouteId : " + routePickupDetail.getRouteId() + " RequestId: " + routePickupDetail.getRequestId() + " SedIndex : " + routePickupDetail.getSeqIndex())
                .collect(Collectors.joining("\n"));
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


        for (int i = 0; i < vectorPickUp.size(); i++) {
            Pair<Warehouse, ParcelRequest> pair = vectorPickUp.get(i);
            Warehouse warehousePickUp = pair.getFirst();
            ParcelRequest parcelRequest = pair.getSecond();
            RoutePickupDetail routePickupDetail = RoutePickupDetail.builder()
                    .routeId(warehousePickUp.getWarehouseId() + "_pickup_route")
                    .requestId(parcelRequest.getRequestId())
                    .seqIndex(i + 1)
                    .build();
            routePickupDetailVector.add(routePickupDetail);
        }
    }

}
