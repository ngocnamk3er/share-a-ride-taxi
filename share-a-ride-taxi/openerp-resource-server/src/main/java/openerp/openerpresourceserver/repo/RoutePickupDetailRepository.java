package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RoutePickupDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoutePickupDetailRepository extends JpaRepository<RoutePickupDetail, String> {
}
