package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RouteWarehouseDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface RouteWarehouseDetailRepository extends JpaRepository<RouteWarehouseDetail, UUID> {
    // You can add custom query methods if needed
}
