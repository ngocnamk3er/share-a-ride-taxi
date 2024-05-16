package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RouteDropoffDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RouteDropoffDetailRepository extends JpaRepository<RouteDropoffDetail, UUID> {
}