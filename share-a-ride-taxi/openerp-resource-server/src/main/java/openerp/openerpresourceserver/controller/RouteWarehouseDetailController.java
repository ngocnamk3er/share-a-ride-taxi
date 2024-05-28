package openerp.openerpresourceserver.controller;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.RouteWarehouseDetail;
import openerp.openerpresourceserver.service.Interface.RouteWarehouseDetailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/route-warehouse-details")
@AllArgsConstructor
public class RouteWarehouseDetailController {

    private final RouteWarehouseDetailService routeWarehouseDetailService;

    @GetMapping("/route-come-in/{warehouseId}")
    public ResponseEntity<List<RouteWarehouseDetail>> getRouteWarehouseDetailById(@PathVariable String warehouseId) {
        List<RouteWarehouseDetail> detail = routeWarehouseDetailService.findRouteComeIn(warehouseId);
        if (detail == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(detail);
    }
}
