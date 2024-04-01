package openerp.openerpresourceserver.service.Impl;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.Route;
import openerp.openerpresourceserver.repo.RouteRepository;
import openerp.openerpresourceserver.service.RouteService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteRepository routeRepository;


    @Override
    public List<Route> getAllRoutes() {
        return routeRepository.findAll();
    }

    @Override
    public Route getRouteById(UUID id) {
        return routeRepository.findById(id).orElse(null);
    }

    @Override
    public Route createRoute(Route route) {
        LocalDateTime currentTime = LocalDateTime.now();
        route.setLastUpdatedStamp(currentTime);
        route.setCreatedStamp(currentTime);
        return routeRepository.save(route);
    }

    @Override
    public void deleteRoute(UUID id) {
        routeRepository.deleteById(id);
    }

    @Override
    public List<Route> searchRoutes(UUID driverId) {
        return routeRepository.findByDriverId(driverId);
    }

    @Override
    public Route updateRoute(UUID id, Route routeDetails) {
        if (routeRepository.existsById(id)) {
            LocalDateTime currentTime = LocalDateTime.now();
            routeDetails.setLastUpdatedStamp(currentTime);
            routeDetails.setId(id);
            return routeRepository.save(routeDetails);
        }
        return null;
    }


}
