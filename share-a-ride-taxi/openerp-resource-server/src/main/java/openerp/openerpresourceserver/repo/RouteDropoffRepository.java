package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RouteDropoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteDropoffRepository extends JpaRepository<RouteDropoff, String> {
    List<RouteDropoff> findByDriverId(String driverId);

    List<RouteDropoff> findByWareHouseId(String wareHouseId);
}