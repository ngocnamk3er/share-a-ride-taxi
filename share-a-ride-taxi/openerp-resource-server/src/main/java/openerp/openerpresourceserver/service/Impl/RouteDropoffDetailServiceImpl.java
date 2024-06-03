package openerp.openerpresourceserver.service.Impl;

import jakarta.transaction.Transactional;
import openerp.openerpresourceserver.entity.RouteDropoffDetail;
import openerp.openerpresourceserver.repo.RouteDropoffDetailRepository;
import openerp.openerpresourceserver.service.Interface.RouteDropoffDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RouteDropoffDetailServiceImpl implements RouteDropoffDetailService {

    @Autowired
    private RouteDropoffDetailRepository routeDropoffDetailRepository;

    @Override
    public List<RouteDropoffDetail> getAllRouteDropoffDetails() {
        return routeDropoffDetailRepository.findAll();
    }

    @Override
    public RouteDropoffDetail getRouteDropoffDetailById(UUID id) {
        Optional<RouteDropoffDetail> optionalRouteDropoffDetail = routeDropoffDetailRepository.findById(id);
        return optionalRouteDropoffDetail.orElse(null);
    }

    @Override
    public RouteDropoffDetail createRouteDropoffDetail(RouteDropoffDetail routeDropoffDetail) {
        LocalDateTime now = LocalDateTime.now();
        routeDropoffDetail.setCreatedStamp(now);
        routeDropoffDetail.setLastUpdatedStamp(now);
        return routeDropoffDetailRepository.save(routeDropoffDetail);
    }

    @Override
    public RouteDropoffDetail updateRouteDropoffDetail(UUID id, RouteDropoffDetail routeDropoffDetail) {
        routeDropoffDetail.setId(id);
        LocalDateTime now = LocalDateTime.now();
        routeDropoffDetail.setLastUpdatedStamp(now);
        return routeDropoffDetailRepository.save(routeDropoffDetail);
    }

    @Override
    public void deleteRouteDropoffDetail(UUID id) {
        routeDropoffDetailRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteAllByRouteId(String routeId) {
        routeDropoffDetailRepository.deleteAllByRouteId(routeId);
    }

    @Override
    public List<RouteDropoffDetail> findAllByRouteId(String routeId) {
        return routeDropoffDetailRepository.findAllByRouteId(routeId);
    }

    @Override
    public RouteDropoffDetail updateVisitedStatus(String routeId, UUID requestId, boolean visited) {
        RouteDropoffDetail routeDropoffDetail = routeDropoffDetailRepository.findByRouteIdAndRequestId(routeId, requestId);
        if (routeDropoffDetail != null) {
            routeDropoffDetail.setVisited(visited);
            return routeDropoffDetailRepository.save(routeDropoffDetail);
        } else {
            return null;
        }
    }
}
