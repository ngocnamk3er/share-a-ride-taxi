package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.RouteDropoff;
import openerp.openerpresourceserver.entity.RoutePickupDetail;

import java.util.List;
import java.util.UUID;

public interface RoutePickupDetailService {
    RoutePickupDetail save(RoutePickupDetail routePickupDetail);

    RoutePickupDetail update(UUID id, RoutePickupDetail routePickupDetail);

    RoutePickupDetail findById(UUID id);

    List<RoutePickupDetail> findAllByRouteId(String routeId);

    List<RoutePickupDetail> findAll();
    void deleteById(UUID id);

    void deleteAllByRouteId(String routeId);
    // Thêm các phương thức khác cần thiết tại đây
}