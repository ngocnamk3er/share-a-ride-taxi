package openerp.openerpresourceserver.repo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import openerp.openerpresourceserver.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DriverRepository extends JpaRepository<Driver, UUID> {
    Driver findByUserId(String userId);

    boolean existsByUserId(String userId);

    @Query(value = "SELECT d.* FROM public.sar_drivers d " +
            "INNER JOIN public.sar_driver_warehouse dw ON d.user_id = dw.driver_id " +
            "INNER JOIN public.sar_warehouse w ON w.warehouse_id = dw.warehouse_id " +
            "WHERE w.warehouse_id = :warehouseId", nativeQuery = true)
    List<Driver> findByWarehouseId(@Param("warehouseId") String warehouseId);
}
