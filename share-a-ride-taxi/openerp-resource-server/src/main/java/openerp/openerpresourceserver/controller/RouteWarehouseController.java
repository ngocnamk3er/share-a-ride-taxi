package openerp.openerpresourceserver.controller;

import openerp.openerpresourceserver.entity.RouteDropoff;
import openerp.openerpresourceserver.entity.RouteWarehouse;
import openerp.openerpresourceserver.service.Interface.RouteWarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/route-warehouses")
public class RouteWarehouseController {

    private final RouteWarehouseService routeWarehouseService;

    @Autowired
    public RouteWarehouseController(RouteWarehouseService routeWarehouseService) {
        this.routeWarehouseService = routeWarehouseService;
    }

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
}
