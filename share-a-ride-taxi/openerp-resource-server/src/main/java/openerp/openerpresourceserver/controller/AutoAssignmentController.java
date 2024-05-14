package openerp.openerpresourceserver.controller;


import com.graphhopper.ResponsePath;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.entity.Warehouse;
import openerp.openerpresourceserver.service.GraphHopperCalculator;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import openerp.openerpresourceserver.service.ParcelRequestService;
import openerp.openerpresourceserver.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/auto-assign")
@PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
public class AutoAssignmentController {

    private final ParcelRequestService parcelRequestService;
    private final WarehouseService warehouseService;
    private final GraphHopperCalculator graphHopperCalculator;

    @GetMapping("/hello")
    public ResponseEntity<String> hello() throws Exception {
        List<ParcelRequest> parcelPassengers = parcelRequestService.getAllParcelRequests();
        List<Warehouse> warehouses = warehouseService.getAllWarehouses();
        Vector<Pair<String, String>> vector = new Vector<>();
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
                if (pickUpWarehousePath.getDistance() < distancePickUp){
                    distancePickUp = pickUpWarehousePath.getDistance();
                    pickUpWarehouse = warehouse;
                }

                ResponsePath dropOffWarehousePath = graphHopperCalculator.calculate(wareHouseLocation, parcelRequestDropOffLocation);
                if (dropOffWarehousePath.getDistance() < distanceDropOff) {
                    distanceDropOff = dropOffWarehousePath.getDistance();
                    dropOffWarehouse = warehouse;
                }
            }
            vector.add(Pair.of(pickUpWarehouse.getWarehouseId(), parcelRequest.getSenderName()+"pickup"));
            vector.add(Pair.of(dropOffWarehouse.getWarehouseId(), parcelRequest.getSenderName()+"dropoff"));
        }
        vector.sort(Comparator.comparing(Pair::getFirst));

        String result = vector.stream()
                .map(pair -> "Key: " + pair.getFirst() + ", Value: " + pair.getSecond())
                .collect(Collectors.joining("\n"));

        return ResponseEntity.ok(result);

    }
}
