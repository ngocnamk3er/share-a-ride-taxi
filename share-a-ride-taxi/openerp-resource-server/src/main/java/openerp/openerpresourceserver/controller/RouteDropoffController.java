package openerp.openerpresourceserver.controller;

import openerp.openerpresourceserver.entity.RouteDropoff;
import openerp.openerpresourceserver.service.Interface.RouteDropoffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/route-dropoffs")
public class RouteDropoffController {

    @Autowired
    private RouteDropoffService routeDropoffService;

    @GetMapping
    public List<RouteDropoff> getAllRouteDropoffs() {
        return routeDropoffService.getAllRouteDropoffs();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteDropoff> getRouteDropoffById(@PathVariable String id) {
        Optional<RouteDropoff> routeDropoff = routeDropoffService.getRouteDropoffById(id);
        return routeDropoff.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public RouteDropoff createRouteDropoff(@RequestBody RouteDropoff routeDropoff) {
        return routeDropoffService.createRouteDropoff(routeDropoff);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RouteDropoff> updateRouteDropoff(@PathVariable String id, @RequestBody RouteDropoff routeDropoff) {
        if (!routeDropoffService.getRouteDropoffById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        routeDropoff.setId(id);
        RouteDropoff updatedRouteDropoff = routeDropoffService.updateRouteDropoff(id, routeDropoff);
        return ResponseEntity.ok(updatedRouteDropoff);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRouteDropoff(@PathVariable String id) {
        if (!routeDropoffService.getRouteDropoffById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        routeDropoffService.deleteRouteDropoff(id);
        return ResponseEntity.noContent().build();
    }
}
