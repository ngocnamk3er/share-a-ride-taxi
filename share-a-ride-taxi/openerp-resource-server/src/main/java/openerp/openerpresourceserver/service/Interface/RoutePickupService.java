package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.RoutePickup;
import openerp.openerpresourceserver.entity.RoutePickupDetail;

import java.util.List;

public interface RoutePickupService {
    RoutePickup save(RoutePickup routePickup);
    RoutePickup update(String id, RoutePickup routePickup);

    RoutePickup findById(String id);
    List<RoutePickup> findAll();
    void deleteById(String id);

    List<RoutePickup> findByDriverId(String driverId);

    List<RoutePickup> findByWarehouseId(String warehouseId);
    // Thêm các phương thức khác cần thiết tại đây
}