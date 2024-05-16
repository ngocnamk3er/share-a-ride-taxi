package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.RouteWarehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RouteWarehouseRepository extends JpaRepository<RouteWarehouse, String> {
    // Để tùy chỉnh các phương thức truy vấn nếu cần thiết
}
