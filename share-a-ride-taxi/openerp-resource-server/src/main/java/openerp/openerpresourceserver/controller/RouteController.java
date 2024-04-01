package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.Route;
import openerp.openerpresourceserver.entity.RouteDetail;
import openerp.openerpresourceserver.service.RouteDetailService;
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
    private final RouteDetailService routeDetailService;

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
        Route createdRoute = routeService.createRoute(route);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRoute);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Route> updateRoute(@PathVariable UUID id, @RequestBody Route route) {
        Route updatedRoute = routeService.updateRoute(id, route);
        if (updatedRoute != null) {
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

    @PostMapping("/{routeId}/route-details")
    public ResponseEntity<?> updateRouteDetailsForRoute(@PathVariable("routeId") UUID routeId, @RequestBody List<RouteDetail> routeDetails) {
        Route existingRoute = routeService.getRouteById(routeId);
        if (existingRoute == null) {
            return new ResponseEntity<>("\"Route not found\"", HttpStatus.NOT_FOUND);
        }

        // Xóa tất cả RouteDetail của Route hiện tại
        routeDetailService.deleteRouteDetailsByRouteId(routeId);

        // Thêm mới danh sách RouteDetail được cung cấp
        for (RouteDetail routeDetail : routeDetails) {
            routeDetail.setRouteId(routeId);
            routeDetailService.createRouteDetail(routeDetail);
        }

        return new ResponseEntity<>("\"RouteDetails updated for Route successfully\"", HttpStatus.OK);
    }


    @GetMapping("/search")
    public ResponseEntity<List<Route>> searchRoutes(
            @RequestParam(value = "driverId", required = false) UUID driverId
    ) {
        List<Route> routes = routeService.searchRoutes(driverId);
        return ResponseEntity.ok(routes);
    }
}
