package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.RouteWarehouse;
import openerp.openerpresourceserver.repo.RouteWarehouseRepository;
import openerp.openerpresourceserver.service.Interface.RouteWarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RouteWarehouseServiceImpl implements RouteWarehouseService {

    private final RouteWarehouseRepository repository;

    @Autowired
    public RouteWarehouseServiceImpl(RouteWarehouseRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<RouteWarehouse> getAllRoutes() {
        return repository.findAll();
    }

    @Override
    public RouteWarehouse getRouteById(String id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public RouteWarehouse createRoute(RouteWarehouse route) {
        LocalDateTime now = LocalDateTime.now();
        route.setCreatedStamp(now);
        route.setLastUpdatedStamp(now);
        return repository.save(route);
    }

    @Override
    public RouteWarehouse updateRoute(String id, RouteWarehouse route) {
        route.setId(id); // Ensure the ID in the object matches the ID in the path
        LocalDateTime now = LocalDateTime.now();
        if (!repository.existsById(id)) {
            System.out.println("not found");
            return null;
        }
        route.setLastUpdatedStamp(now);
        return repository.save(route);
    }

    @Override
    public void deleteRoute(String id) {
        repository.deleteById(id);
    }

    @Override
    public List<RouteWarehouse> findByDriverId(String driverId) {
        return repository.findByDriverId(driverId);
    }
}
