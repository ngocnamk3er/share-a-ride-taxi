package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RouteWarehouseDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RouteWarehouseDetailRepository extends JpaRepository<RouteWarehouseDetail, UUID> {

    @Query("SELECT rwd FROM RouteWarehouseDetail rwd WHERE rwd.warehouseId = :warehouseId AND rwd.seqIndex != 1")
    List<RouteWarehouseDetail> findRouteComeIn(String warehouseId);
    // You can add custom query methods if needed
}
