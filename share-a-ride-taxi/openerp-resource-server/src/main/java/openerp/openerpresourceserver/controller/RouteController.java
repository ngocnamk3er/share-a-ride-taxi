package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.Route;
import openerp.openerpresourceserver.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    @GetMapping
    public ResponseEntity<List<Route>> getAllRoutes() {
        List<Route> routes = routeService.getAllRoutes();
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Route> getRouteById(@PathVariable UUID id) {
        Route route = routeService.getRouteById(id);
        if (route != null) {
            return ResponseEntity.ok(route);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Route> createRoute(@RequestBody Route route) {
        // Đặt thời gian hiện tại cho lastUpdatedStamp và createdStamp trước khi lưu đối tượng Route
        LocalDateTime currentTime = LocalDateTime.now();
        route.setLastUpdatedStamp(currentTime);
        route.setCreatedStamp(currentTime);

        Route createdRoute = routeService.createRoute(route);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoute);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> updateRoute(@PathVariable UUID id, @RequestBody Route routeDetails) {
        Route existingRoute = routeService.getRouteById(id);
        if (existingRoute != null) {
            // Cập nhật thông tin của tuyến đường
            existingRoute.setStartExecutionStamp(routeDetails.getStartExecutionStamp());
            existingRoute.setLastUpdatedStamp(LocalDateTime.now()); // Cập nhật thời điểm cập nhật cuối cùng
            existingRoute.setDriverId(routeDetails.getDriverId());
            // Cập nhật các trường thông tin khác cần thiết

            Route updatedRoute = routeService.createRoute(existingRoute); // Sử dụng createRoute để cập nhật đối tượng đã tồn tại
            return ResponseEntity.ok(updatedRoute);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoute(@PathVariable UUID id) {
        Route existingRoute = routeService.getRouteById(id);
        if (existingRoute != null) {
            routeService.deleteRoute(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Route>> searchRoutes(
            @RequestParam(value = "driverId", required = false) UUID driverId
    ) {
        List<Route> routes = routeService.searchRoutes(driverId);
        return ResponseEntity.ok(routes);
    }
}
