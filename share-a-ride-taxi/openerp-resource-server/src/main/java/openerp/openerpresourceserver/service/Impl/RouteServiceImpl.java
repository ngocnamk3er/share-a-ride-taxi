package openerp.openerpresourceserver.service.Impl;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.Route;
import openerp.openerpresourceserver.repo.RouteRepository;
import openerp.openerpresourceserver.service.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
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
}
