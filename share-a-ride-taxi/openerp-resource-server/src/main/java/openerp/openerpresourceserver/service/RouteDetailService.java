package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.RouteDetail;
import java.util.List;
import java.util.UUID;

public interface RouteDetailService {
    List<RouteDetail> getAllRouteDetails();
    RouteDetail getRouteDetailById(UUID id);
    RouteDetail createRouteDetail(RouteDetail routeDetail);
    RouteDetail updateRouteDetail(UUID id, RouteDetail routeDetail);
    void deleteRouteDetail(UUID id);
}
