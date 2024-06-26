package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.RouteWarehouseDetail;

import java.util.List;
import java.util.UUID;

public interface RouteWarehouseDetailService {
    RouteWarehouseDetail save(RouteWarehouseDetail detail);

    RouteWarehouseDetail update(UUID id, RouteWarehouseDetail detail);

    void deleteById(UUID id);

    List<RouteWarehouseDetail> findAll();

    RouteWarehouseDetail findById(UUID id);

    List<RouteWarehouseDetail> findRouteComeIn(String warehouseId);

    void deleteAllByRouteId(String routeId);

    RouteWarehouseDetail updateVisitedStatus(UUID id, boolean visited);

    List<RouteWarehouseDetail> findByRouteId(String routeId);

    // You can add more service methods as needed
}
