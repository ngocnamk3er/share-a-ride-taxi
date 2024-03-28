package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.repo.RouteDetailRepository;
import openerp.openerpresourceserver.service.RouteDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import openerp.openerpresourceserver.entity.RouteDetail;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RouteDetailServiceImpl implements RouteDetailService {

    private final RouteDetailRepository routeDetailRepository;

    @Autowired
    public RouteDetailServiceImpl(RouteDetailRepository routeDetailRepository) {
        this.routeDetailRepository = routeDetailRepository;
    }

    @Override
    public List<RouteDetail> getAllRouteDetails() {
        return routeDetailRepository.findAll();
    }

    @Override
    public RouteDetail getRouteDetailById(UUID id) {
        return routeDetailRepository.findById(id).orElse(null);
    }

    @Override
    public RouteDetail createRouteDetail(RouteDetail routeDetail) {
        return routeDetailRepository.save(routeDetail);
    }

    @Override
    public RouteDetail updateRouteDetail(UUID id, RouteDetail routeDetail) {
        if (routeDetailRepository.existsById(id)) {
            routeDetail.setId(id);
            return routeDetailRepository.save(routeDetail);
        }
        return null;
    }

    @Override
    public void deleteRouteDetail(UUID id) {
        routeDetailRepository.deleteById(id);
    }
}
