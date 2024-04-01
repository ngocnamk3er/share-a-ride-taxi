package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.Route;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface RouteService {
    List<Route> getAllRoutes();

    Route getRouteById(UUID id);

    Route createRoute(Route route);

    void deleteRoute(UUID id);

    List<Route> searchRoutes(UUID driverId);

    Route updateRoute(UUID id, Route routeDetails);
}
