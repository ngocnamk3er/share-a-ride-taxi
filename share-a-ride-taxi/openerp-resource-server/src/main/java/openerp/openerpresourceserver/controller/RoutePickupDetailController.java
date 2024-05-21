package openerp.openerpresourceserver.controller;

import openerp.openerpresourceserver.entity.RoutePickupDetail;
import openerp.openerpresourceserver.service.Interface.RoutePickupDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/route-pickup-details")
public class RoutePickupDetailController {

    @Autowired
    private RoutePickupDetailService routePickupDetailService;

    // API to get all RoutePickupDetail by routeId
    @GetMapping("/by-route/{routeId}")
    public ResponseEntity<List<RoutePickupDetail>> getAllByRouteId(@PathVariable String routeId) {
        List<RoutePickupDetail> routePickupDetails = routePickupDetailService.findAllByRouteId(routeId);
        return ResponseEntity.ok().body(routePickupDetails);
    }

    // API to create a new RoutePickupDetail
    @PostMapping("")
    public ResponseEntity<RoutePickupDetail> create(@RequestBody RoutePickupDetail routePickupDetail) {
        RoutePickupDetail createdRoutePickupDetail = routePickupDetailService.save(routePickupDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoutePickupDetail);
    }

    // API to update an existing RoutePickupDetail
    @PutMapping("/{id}")
    public ResponseEntity<RoutePickupDetail> update(@PathVariable UUID id, @RequestBody RoutePickupDetail routePickupDetail) {
        RoutePickupDetail updatedRoutePickupDetail = routePickupDetailService.update(id, routePickupDetail);
        if (updatedRoutePickupDetail != null) {
            return ResponseEntity.ok().body(updatedRoutePickupDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // API to delete a RoutePickupDetail by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        routePickupDetailService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
