package openerp.openerpresourceserver.controller;

import com.amazonaws.services.ec2.model.Route;
import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.RoutePickup;
import openerp.openerpresourceserver.entity.RoutePickupDetail;
import openerp.openerpresourceserver.service.Interface.RoutePickupDetailService;
import openerp.openerpresourceserver.service.Interface.RoutePickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/route-pickups")
public class RoutePickupController {

    private final RoutePickupService routePickupService;
    private final RoutePickupDetailService routePickupDetailService;

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

    @PostMapping("/{routeId}/pick-up-route-details")
    public ResponseEntity<?> updateRouteDetailsForRoute(@PathVariable("routeId") String routeId, @RequestBody List<RoutePickupDetail> routeDetails) {
        System.out.println("System.out.println(routeDetails);");
        System.out.println(routeDetails);

        // Kiểm tra xem RoutePickup có tồn tại không
        RoutePickup existingRoute = routePickupService.findById(routeId);
        if (existingRoute == null) {
            return new ResponseEntity<>("Route not found", HttpStatus.NOT_FOUND);
        }

        // Xóa tất cả RoutePickupDetail của Route hiện tại
        routePickupDetailService.deleteAllByRouteId(routeId);

        // Thêm mới danh sách RoutePickupDetail được cung cấp
        for (RoutePickupDetail routeDetail : routeDetails) {
            routeDetail.setRouteId(routeId);
            routeDetail.setCreatedStamp(LocalDateTime.now());
            routeDetail.setLastUpdatedStamp(LocalDateTime.now());
            routePickupDetailService.save(routeDetail);
        }

        return ResponseEntity.ok("Route details updated successfully");
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
