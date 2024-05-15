package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.RoutePickup;
import openerp.openerpresourceserver.repo.RoutePickupRepository;
import openerp.openerpresourceserver.service.RoutePickupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoutePickupServiceImpl implements RoutePickupService {

    @Autowired
    private RoutePickupRepository routePickupRepository;

    @Override
    public RoutePickup save(RoutePickup routePickup) {
        return routePickupRepository.save(routePickup);
    }

    @Override
    public RoutePickup findById(String id) {
        return routePickupRepository.findById(id).orElse(null);
    }

    @Override
    public List<RoutePickup> findAll() {
        return routePickupRepository.findAll();
    }

    @Override
    public void deleteById(String id) {
        routePickupRepository.deleteById(id);
    }

    // Thêm các phương thức khác cần thiết tại đây
}
