package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.RouteDropoff;
import java.util.List;
import java.util.Optional;

public interface RouteDropoffService {
    List<RouteDropoff> getAllRouteDropoffs();
    Optional<RouteDropoff> getRouteDropoffById(String id);
    RouteDropoff createRouteDropoff(RouteDropoff routeDropoff);
    RouteDropoff updateRouteDropoff(String id, RouteDropoff routeDropoff);
    void deleteRouteDropoff(String id);

    List<RouteDropoff> findByDriverId(String driverId);
}
