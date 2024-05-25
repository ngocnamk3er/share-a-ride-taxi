package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RoutePickupDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoutePickupDetailRepository extends JpaRepository<RoutePickupDetail, UUID> {
    List<RoutePickupDetail> findAllByRouteId(String routeId);

    void deleteAllByRouteId(String routeId);
}
