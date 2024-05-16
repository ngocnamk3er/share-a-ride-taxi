package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.RouteDropoff;
import openerp.openerpresourceserver.repo.RouteDropoffRepository;
import openerp.openerpresourceserver.service.Interface.RouteDropoffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RouteDropoffServiceImpl implements RouteDropoffService {

    @Autowired
    private RouteDropoffRepository routeDropoffRepository;

    @Override
    public List<RouteDropoff> getAllRouteDropoffs() {
        return routeDropoffRepository.findAll();
    }

    @Override
    public Optional<RouteDropoff> getRouteDropoffById(String id) {
        return routeDropoffRepository.findById(id);
    }

    @Override
    public RouteDropoff createRouteDropoff(RouteDropoff routeDropoff) {
        LocalDateTime now = LocalDateTime.now();
        routeDropoff.setCreatedStamp(now);
        routeDropoff.setLastUpdatedStamp(now);
        return routeDropoffRepository.save(routeDropoff);
    }

    @Override
    public RouteDropoff updateRouteDropoff(String id, RouteDropoff routeDropoff) {
        routeDropoff.setId(id);
        LocalDateTime now = LocalDateTime.now();
        routeDropoff.setLastUpdatedStamp(now);
        return routeDropoffRepository.save(routeDropoff);
    }

    @Override
    public void deleteRouteDropoff(String id) {
        routeDropoffRepository.deleteById(id);
    }
}

