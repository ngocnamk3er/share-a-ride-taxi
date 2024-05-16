package openerp.openerpresourceserver.service;
import openerp.openerpresourceserver.entity.RouteWarehouse;

import java.util.List;

public interface RouteWarehouseService {
    List<RouteWarehouse> getAllRoutes();
    RouteWarehouse getRouteById(String id);
    RouteWarehouse createRoute(RouteWarehouse route);
    RouteWarehouse updateRoute(String id, RouteWarehouse route);
    void deleteRoute(String id);
}
