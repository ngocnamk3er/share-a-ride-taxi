package openerp.openerpresourceserver.controller;


import com.graphhopper.ResponsePath;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.entity.RouteWarehouse;
import openerp.openerpresourceserver.entity.Warehouse;
import openerp.openerpresourceserver.service.GraphHopperCalculator;
import openerp.openerpresourceserver.service.Impl.Auto.AutoAssignService;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import openerp.openerpresourceserver.service.ParcelRequestService;
import openerp.openerpresourceserver.service.RouteWarehouseService;
import openerp.openerpresourceserver.service.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/auto-assign")
@PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
public class AutoAssignmentController {

    private final AutoAssignService autoAssignService;
    private final ParcelRequestService parcelRequestService;
    private final WarehouseService warehouseService;
    private final GraphHopperCalculator graphHopperCalculator;
    private final RouteWarehouseService routeWarehouseService;

    @GetMapping("/hello")
    public ResponseEntity<String> hello() throws Exception {
        String result = autoAssignService.autoAssign();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/test")
    public ResponseEntity<String> hello1() throws Exception {
        RouteWarehouse routeWarehouse = RouteWarehouse.builder()
                .id("123")
                .driverId(UUID.randomUUID())
                .startExecuteStamp(LocalDateTime.now())
                .endStamp(LocalDateTime.now())
                .routeStatusId(1)
                .warehouseId("warehouse123")
                .build();
        routeWarehouseService.createRoute(routeWarehouse);
        return ResponseEntity.ok("OK");
    }
}
