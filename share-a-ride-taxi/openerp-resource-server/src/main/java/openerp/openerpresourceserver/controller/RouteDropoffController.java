package openerp.openerpresourceserver.controller;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.RouteDropoff;
import openerp.openerpresourceserver.entity.RouteDropoffDetail;
import openerp.openerpresourceserver.entity.RoutePickup;
import openerp.openerpresourceserver.entity.RoutePickupDetail;
import openerp.openerpresourceserver.service.Interface.RouteDropoffDetailService;
import openerp.openerpresourceserver.service.Interface.RouteDropoffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/route-dropoffs")
public class RouteDropoffController {

    private final RouteDropoffService routeDropoffService;
    private final RouteDropoffDetailService routeDropoffDetailService;

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

    @PostMapping("/{routeId}/drop-off-route-details")
    public ResponseEntity<?> updateRouteDetailsForRoute(@PathVariable("routeId") String routeId, @RequestBody List<RouteDropoffDetail> routeDetails) {
        System.out.println("System.out.println(routeDetails);");
        System.out.println(routeDetails);

        // Kiểm tra xem RoutePickup có tồn tại không
        RouteDropoff existingRoute = routeDropoffService.getRouteDropoffById(routeId).orElse(null);
        if (existingRoute == null) {
            return new ResponseEntity<>("Route not found", HttpStatus.NOT_FOUND);
        }

        // Xóa tất cả RoutePickupDetail của Route hiện tại
        routeDropoffDetailService.deleteAllByRouteId(routeId);

        // Thêm mới danh sách RoutePickupDetail được cung cấp
        for (RouteDropoffDetail routeDetail : routeDetails) {
            routeDetail.setRouteId(routeId);
            routeDetail.setCreatedStamp(LocalDateTime.now());
            routeDetail.setLastUpdatedStamp(LocalDateTime.now());
            routeDropoffDetailService.createRouteDropoffDetail(routeDetail);
        }

        return ResponseEntity.ok("Route details updated successfully");
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<RouteDropoff>> getDropOffRouteByDriverId(@PathVariable("driverId") String driverId) {
        List<RouteDropoff> routes = routeDropoffService.findByDriverId(driverId);
        if (routes == null || routes.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/warehouse/{wareHouseId}")
    public ResponseEntity<List<RouteDropoff>> getDropOffRouteByWareHouseId(@PathVariable("wareHouseId") String wareHouseId) {
        List<RouteDropoff> routes = routeDropoffService.findByWareHouseId(wareHouseId);
        if (routes == null || routes.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(routes);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRoutePickupStatus(@PathVariable String id, @RequestParam Integer status) {
        RouteDropoff existingRoute = routeDropoffService.findById(id);
        if (existingRoute == null) {
            return ResponseEntity.notFound().build();
        }

        existingRoute.setRouteStatusId(status); // Cập nhật trạng thái mới
        existingRoute.setLastUpdatedStamp(LocalDateTime.now()); // Cập nhật thời gian cập nhật mới
        RouteDropoff updatedRouteDropoff = routeDropoffService.updateRouteDropoff(id, existingRoute); // Lưu thay đổi

        return ResponseEntity.ok(updatedRouteDropoff);
    }

}
