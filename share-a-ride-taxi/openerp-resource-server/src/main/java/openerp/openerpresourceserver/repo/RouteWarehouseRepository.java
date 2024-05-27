package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RouteWarehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteWarehouseRepository extends JpaRepository<RouteWarehouse, String> {
    List<RouteWarehouse> findByDriverId(String driverId);
    // Để tùy chỉnh các phương thức truy vấn nếu cần thiết
}
