package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface RouteRepository extends JpaRepository<Route, UUID> {
    List<Route> findByDriverId(UUID driverId);
}