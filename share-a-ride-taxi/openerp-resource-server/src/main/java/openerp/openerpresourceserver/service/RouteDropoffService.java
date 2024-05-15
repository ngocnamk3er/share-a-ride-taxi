package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.RouteDropoff;
import java.util.List;
import java.util.Optional;

public interface RouteDropoffService {
    List<RouteDropoff> getAllRouteDropoffs();
    Optional<RouteDropoff> getRouteDropoffById(String id);
    RouteDropoff createRouteDropoff(RouteDropoff routeDropoff);
    RouteDropoff updateRouteDropoff(String id, RouteDropoff routeDropoff);
    void deleteRouteDropoff(String id);
}
