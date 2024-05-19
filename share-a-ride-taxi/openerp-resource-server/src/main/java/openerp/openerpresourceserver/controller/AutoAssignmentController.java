package openerp.openerpresourceserver.controller;


import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.RouteWarehouse;
import openerp.openerpresourceserver.service.Interface.GraphHopperCalculator;
import openerp.openerpresourceserver.service.Impl.Auto.AutoAssignService;
import openerp.openerpresourceserver.service.Interface.ParcelRequestService;
import openerp.openerpresourceserver.service.Interface.RouteWarehouseService;
import openerp.openerpresourceserver.service.Interface.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/auto-assign")
@PreAuthorize("hasRole('default-roles-openerp-dev')")
public class AutoAssignmentController {

    private final AutoAssignService autoAssignService;
    private final ParcelRequestService parcelRequestService;
    private final WarehouseService warehouseService;
    private final GraphHopperCalculator graphHopperCalculator;
    private final RouteWarehouseService routeWarehouseService;

    @GetMapping("/assign-parcel-route")
    public ResponseEntity<String> hello() throws Exception {
        String result = autoAssignService.autoAssign();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/test")
    public ResponseEntity<String> hello1() throws Exception {
        RouteWarehouse routeWarehouse = RouteWarehouse.builder()
                .id("123")
                .driverId("ngocnamk3er")
                .startExecuteStamp(LocalDateTime.now())
                .endStamp(LocalDateTime.now())
                .routeStatusId(1)
                .startWarehouseId("warehouse123")
                .build();
        routeWarehouseService.createRoute(routeWarehouse);
        return ResponseEntity.ok("OK");
    }
}
