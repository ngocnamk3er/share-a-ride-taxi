package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.RouteDropoff;
import openerp.openerpresourceserver.entity.RoutePickupDetail;

import java.util.List;
import java.util.UUID;

public interface RoutePickupDetailService {
    RoutePickupDetail save(RoutePickupDetail routePickupDetail);

    RoutePickupDetail update(UUID id, RoutePickupDetail routePickupDetail);

    RoutePickupDetail findById(String id);
    List<RoutePickupDetail> findAll();
    void deleteById(String id);
    // Thêm các phương thức khác cần thiết tại đây
}