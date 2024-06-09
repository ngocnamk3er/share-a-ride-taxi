package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.*;
import openerp.openerpresourceserver.enums.RouteStatus;
import openerp.openerpresourceserver.service.Interface.RouteWarehouseDetailService;
import openerp.openerpresourceserver.service.Interface.RouteWarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/route-warehouses")
@RequiredArgsConstructor
public class RouteWarehouseController {

    private final RouteWarehouseService routeWarehouseService;
    private final RouteWarehouseDetailService routeWarehouseDetailService;

    @GetMapping
    public List<RouteWarehouse> getAllRouteWarehouses() {
        return routeWarehouseService.getAllRoutes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteWarehouse> getRouteWarehouseById(@PathVariable String id) {
        RouteWarehouse routeWarehouse = routeWarehouseService.getRouteById(id);
        if (routeWarehouse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(routeWarehouse);
    }

    @PostMapping
    public ResponseEntity<RouteWarehouse> createRouteWarehouse(@RequestBody RouteWarehouse routeWarehouse) {
        RouteWarehouse createdRouteWarehouse = routeWarehouseService.createRoute(routeWarehouse);
        return ResponseEntity.ok(createdRouteWarehouse);
    }
    @PostMapping("/{routeId}/warehouse-route-details")
    public ResponseEntity<?> updateRouteDetailsForRoute(@PathVariable("routeId") String routeId, @RequestBody List<RouteWarehouseDetail> routeDetails) {
        System.out.println("System.out.println(routeDetails);");
        System.out.println(routeDetails);

        // Kiểm tra xem RoutePickup có tồn tại không
        RouteWarehouse existingRoute = routeWarehouseService.getRouteById(routeId);
        if (existingRoute == null) {
            return new ResponseEntity<>("Route not found", HttpStatus.NOT_FOUND);
        }

        // Xóa tất cả RoutePickupDetail của Route hiện tại
        routeWarehouseDetailService.deleteAllByRouteId(routeId);

        // Thêm mới danh sách RoutePickupDetail được cung cấp
        for (RouteWarehouseDetail routeDetail : routeDetails) {
            routeDetail.setRouteId(routeId);
            routeDetail.setCreatedStamp(LocalDateTime.now());
            routeDetail.setLastUpdatedStamp(LocalDateTime.now());
            routeWarehouseDetailService.save(routeDetail);
        }

        return ResponseEntity.ok("Route details updated successfully");
    }
    @PutMapping("/{id}")
    public ResponseEntity<RouteWarehouse> updateRouteWarehouse(@PathVariable String id, @RequestBody RouteWarehouse routeWarehouse) {
        RouteWarehouse existingRouteWarehouse = routeWarehouseService.getRouteById(id);
        if (existingRouteWarehouse == null) {
            return ResponseEntity.notFound().build();
        }
        routeWarehouse.setId(id);
        RouteWarehouse updatedRouteWarehouse = routeWarehouseService.updateRoute(id, routeWarehouse);
        return ResponseEntity.ok(updatedRouteWarehouse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRouteWarehouse(@PathVariable String id) {
        RouteWarehouse existingRouteWarehouse = routeWarehouseService.getRouteById(id);
        if (existingRouteWarehouse == null) {
            return ResponseEntity.notFound().build();
        }
        routeWarehouseService.deleteRoute(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<RouteWarehouse>> getPickUpRouteByDriverId(@PathVariable String driverId) {
        List<RouteWarehouse> routes = routeWarehouseService.findByDriverId(driverId);
        if (routes == null || routes.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/start-warehouse/{startWareHouseId}")
    public ResponseEntity<List<RouteWarehouse>> getWareHouseRouteByStartWarehouseId(@PathVariable("startWareHouseId") String startWareHouseId) {
        List<RouteWarehouse> routes = routeWarehouseService.getWareHouseRouteByStartWarehouseId(startWareHouseId);
        if (routes == null || routes.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(routes);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<RouteWarehouse> updateRouteStatus(@PathVariable String id, @RequestParam Integer statusId) {
        RouteWarehouse existingRouteWarehouse = routeWarehouseService.getRouteById(id);
        if (existingRouteWarehouse == null) {
            return ResponseEntity.notFound().build();
        }

        if(statusId == RouteStatus.IN_TRANSIT.ordinal()){
            existingRouteWarehouse.setStartExecuteStamp(LocalDateTime.now());
        }
        if(statusId == RouteStatus.COMPLETE.ordinal()){
            existingRouteWarehouse.setEndStamp(LocalDateTime.now());
        }

        existingRouteWarehouse.setRouteStatusId(statusId);
        RouteWarehouse updatedRouteWarehouse = routeWarehouseService.updateRoute(id, existingRouteWarehouse);
        return ResponseEntity.ok(updatedRouteWarehouse);
    }
}
