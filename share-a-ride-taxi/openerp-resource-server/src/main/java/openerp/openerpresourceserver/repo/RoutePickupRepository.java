package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RoutePickup;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoutePickupRepository extends JpaRepository<RoutePickup, String> {
}