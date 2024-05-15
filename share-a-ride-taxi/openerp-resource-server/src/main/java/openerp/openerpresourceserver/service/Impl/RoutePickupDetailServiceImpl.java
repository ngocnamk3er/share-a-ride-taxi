package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.RoutePickupDetail;
import openerp.openerpresourceserver.repo.RoutePickupDetailRepository;
import openerp.openerpresourceserver.service.RoutePickupDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RoutePickupDetailServiceImpl implements RoutePickupDetailService {

    @Autowired
    private RoutePickupDetailRepository routePickupDetailRepository;

    @Override
    public RoutePickupDetail save(RoutePickupDetail routePickupDetail) {
        return routePickupDetailRepository.save(routePickupDetail);
    }

    @Override
    public RoutePickupDetail findById(String id) {
        return routePickupDetailRepository.findById(id).orElse(null);
    }

    @Override
    public List<RoutePickupDetail> findAll() {
        return routePickupDetailRepository.findAll();
    }

    @Override
    public void deleteById(String id) {
        routePickupDetailRepository.deleteById(id);
    }

    // Thêm các phương thức khác cần thiết tại đây
}
