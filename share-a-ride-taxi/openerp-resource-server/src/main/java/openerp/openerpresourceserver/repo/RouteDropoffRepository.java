package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RouteDropoff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteDropoffRepository extends JpaRepository<RouteDropoff, String> {
}