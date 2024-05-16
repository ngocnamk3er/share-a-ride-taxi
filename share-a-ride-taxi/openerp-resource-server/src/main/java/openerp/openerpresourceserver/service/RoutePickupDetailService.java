package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.RouteDropoff;
import openerp.openerpresourceserver.entity.RoutePickupDetail;

import java.util.List;

public interface RoutePickupDetailService {
    RoutePickupDetail save(RoutePickupDetail routePickupDetail);

    RoutePickupDetail update(String id, RoutePickupDetail routePickupDetail);

    RoutePickupDetail findById(String id);
    List<RoutePickupDetail> findAll();
    void deleteById(String id);
    // Thêm các phương thức khác cần thiết tại đây
}