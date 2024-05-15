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

    public String autoAssign() throws Exception {
        List<ParcelRequest> parcelPassengers = parcelRequestService.getAllParcelRequests();
        List<Warehouse> warehouses = warehouseService.getAllWarehouses();
        Vector<Pair<Warehouse, ParcelRequest>> vectorPickUp = new Vector<>();
        Vector<Pair<Warehouse, ParcelRequest>> vectorDropOff = new Vector<>();
        for (ParcelRequest parcelRequest : parcelPassengers) {
            Coordinate parcelRequestPickUpLocation = new Coordinate(parcelRequest.getPickupLatitude(), parcelRequest.getPickupLongitude());
            Coordinate parcelRequestDropOffLocation = new Coordinate(parcelRequest.getDropoffLatitude(), parcelRequest.getDropoffLongitude());
            Warehouse pickUpWarehouse = new Warehouse();
            Warehouse dropOffWarehouse = new Warehouse();
            Double distancePickUp = Double.MAX_VALUE;
            Double distanceDropOff = Double.MAX_VALUE;
            for (Warehouse warehouse : warehouses) {
                Coordinate wareHouseLocation = new Coordinate(warehouse.getLat(), warehouse.getLon());
                ResponsePath pickUpWarehousePath = graphHopperCalculator.calculate(parcelRequestPickUpLocation, wareHouseLocation);
                if (pickUpWarehousePath.getDistance() < distancePickUp) {
                    distancePickUp = pickUpWarehousePath.getDistance();
                    pickUpWarehouse = warehouse;
                }

                ResponsePath dropOffWarehousePath = graphHopperCalculator.calculate(wareHouseLocation, parcelRequestDropOffLocation);
                if (dropOffWarehousePath.getDistance() < distanceDropOff) {
                    distanceDropOff = dropOffWarehousePath.getDistance();
                    dropOffWarehouse = warehouse;
                }
            }
            vectorPickUp.add(Pair.of(pickUpWarehouse, parcelRequest));
            vectorDropOff.add(Pair.of(dropOffWarehouse, parcelRequest));
        }
        vectorPickUp.sort(Comparator.comparing(pair -> pair.getFirst().getWarehouseId()));

        vectorDropOff.sort(Comparator.comparing(pair -> pair.getFirst().getWarehouseId()));

        Set<String> pickUpWareHouseName = new HashSet<>(); // Khởi tạo một Set rỗng để lưu trữ wareHouseId
        Vector<RoutePickup> vectorRoutePickup = new Vector<>();

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


        Vector<RoutePickupDetail> routePickupDetailVector = new Vector<>();

        for (int i = 0; i < vectorPickUp.size(); i++) {
            Pair<Warehouse, ParcelRequest> pair = vectorPickUp.get(i);
            Warehouse warehousePickUp = pair.getFirst();
            ParcelRequest parcelRequest = pair.getSecond();
            RoutePickupDetail routePickupDetail = RoutePickupDetail.builder()
                    .routeId(warehousePickUp.getWarehouseId() + "_pickup_route")
                    .requestId(parcelRequest.getRequestId())
                    .seqIndex(i+1)
                    .build();
            routePickupDetailVector.add(routePickupDetail);
        }



//        return vectorRoutePickup.stream()
//                .map(routePickup -> "Id: " + routePickup.getId() + " WarehouseId: " + routePickup.getWareHouseId())
//                .collect(Collectors.joining("\n"));

        return routePickupDetailVector.stream()
                .map(routePickupDetail -> "RouteId : " + routePickupDetail.getRouteId() + " RequestId: " + routePickupDetail.getRequestId() + " SedIndex : " + routePickupDetail.getSeqIndex())
                .collect(Collectors.joining("\n"));
    }


}
