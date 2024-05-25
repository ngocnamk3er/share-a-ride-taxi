package openerp.openerpresourceserver.controller;

import openerp.openerpresourceserver.entity.RoutePickup;
import openerp.openerpresourceserver.service.Interface.RoutePickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/route-pickups")
public class RoutePickupController {

    @Autowired
    private RoutePickupService routePickupService;

    @PostMapping
    public ResponseEntity<RoutePickup> createRoutePickup(@RequestBody RoutePickup routePickup) {
        RoutePickup createdRoutePickup = routePickupService.save(routePickup);
        return ResponseEntity.ok(createdRoutePickup);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoutePickup> updateRoutePickup(@PathVariable String id, @RequestBody RoutePickup routePickup) {
        if (routePickupService.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        routePickup.setId(id);
        RoutePickup updatedRoutePickup = routePickupService.update(id, routePickup);
        return ResponseEntity.ok(updatedRoutePickup);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoutePickup> getRoutePickupById(@PathVariable String id) {
        RoutePickup routePickup = routePickupService.findById(id);
        if (routePickup == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(routePickup);
    }



    @GetMapping
    public List<RoutePickup> getAllRoutePickups() {
        return routePickupService.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoutePickup(@PathVariable String id) {
        if (routePickupService.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        routePickupService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
