package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RouteDropoffDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RouteDropoffDetailRepository extends JpaRepository<RouteDropoffDetail, UUID> {
    void deleteAllByRouteId(String routeId);

    List<RouteDropoffDetail> findAllByRouteId(String routeId);

    RouteDropoffDetail findByRouteIdAndRequestId(String routeId, UUID requestId);
}
