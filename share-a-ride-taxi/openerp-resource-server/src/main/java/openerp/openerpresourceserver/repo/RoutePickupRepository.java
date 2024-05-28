package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RoutePickup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoutePickupRepository extends JpaRepository<RoutePickup, String> {
    List<RoutePickup> findByDriverId(String driverId);

    List<RoutePickup> findByWareHouseId(String wareHouseId);
}