package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.RoutePickupDetail;
import openerp.openerpresourceserver.repo.RoutePickupDetailRepository;
import openerp.openerpresourceserver.service.Interface.RoutePickupDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RoutePickupDetailServiceImpl implements RoutePickupDetailService {

    @Autowired
    private RoutePickupDetailRepository routePickupDetailRepository;

    @Override
    public RoutePickupDetail save(RoutePickupDetail routePickupDetail) {
        LocalDateTime now = LocalDateTime.now();
        routePickupDetail.setCreatedStamp(now);
        routePickupDetail.setLastUpdatedStamp(now);
        return routePickupDetailRepository.save(routePickupDetail);
    }

    @Override
    public RoutePickupDetail update(UUID id, RoutePickupDetail routePickupDetail) {
        routePickupDetail.setId(id);
        LocalDateTime now = LocalDateTime.now();
        routePickupDetail.setLastUpdatedStamp(now);
        return routePickupDetailRepository.save(routePickupDetail);
    }

    @Override
    public RoutePickupDetail findById(UUID id) {
        return routePickupDetailRepository.findById(id).orElse(null);
    }

    @Override
    public List<RoutePickupDetail> findAllByRouteId(String routeId){
        return routePickupDetailRepository.findAllByRouteId(routeId);
    };
    @Override
    public List<RoutePickupDetail> findAll() {
        return routePickupDetailRepository.findAll();
    }

    @Override
    public void deleteById(UUID id) {
        routePickupDetailRepository.deleteById(id);
    }

    // Thêm các phương thức khác cần thiết tại đây
}
