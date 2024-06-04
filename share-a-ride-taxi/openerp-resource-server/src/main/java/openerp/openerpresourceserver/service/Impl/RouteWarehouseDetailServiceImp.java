package openerp.openerpresourceserver.service.Impl;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.RouteWarehouseDetail;
import openerp.openerpresourceserver.repo.RouteWarehouseDetailRepository;
import openerp.openerpresourceserver.service.Interface.RouteWarehouseDetailService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class RouteWarehouseDetailServiceImp implements RouteWarehouseDetailService {

    private final RouteWarehouseDetailRepository routeWarehouseDetailRepository;

    @Override
    public RouteWarehouseDetail save(RouteWarehouseDetail detail) {
        LocalDateTime now = LocalDateTime.now();
        detail.setCreatedStamp(now);
        detail.setLastUpdatedStamp(now);
        return routeWarehouseDetailRepository.save(detail);
    }

    @Override
    public RouteWarehouseDetail update(UUID id, RouteWarehouseDetail detail) {
        if (!routeWarehouseDetailRepository.existsById(id)) {
            return null;
        }
        detail.setId(id);
        LocalDateTime now = LocalDateTime.now();
        detail.setLastUpdatedStamp(now);
        return routeWarehouseDetailRepository.save(detail);
    }

    @Override
    public void deleteById(UUID id) {
        routeWarehouseDetailRepository.deleteById(id);
    }

    @Override
    public List<RouteWarehouseDetail> findAll() {
        return routeWarehouseDetailRepository.findAll();
    }

    @Override
    public RouteWarehouseDetail findById(UUID id) {
        return routeWarehouseDetailRepository.findById(id).orElse(null);
    }

    @Override
    public List<RouteWarehouseDetail> findRouteComeIn(String warehouseId) {
        return routeWarehouseDetailRepository.findRouteComeIn(warehouseId);
    }

    @Override
    public RouteWarehouseDetail updateVisitedStatus(UUID id, boolean visited) {
        Optional<RouteWarehouseDetail> detailOptional = routeWarehouseDetailRepository.findById(id);
        if (detailOptional.isPresent()) {
            RouteWarehouseDetail detail = detailOptional.get();
            detail.setVisited(visited);
            detail.setLastUpdatedStamp(LocalDateTime.now());
            return routeWarehouseDetailRepository.save(detail);
        }
        return null;
    }
}
