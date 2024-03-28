package openerp.openerpresourceserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import openerp.openerpresourceserver.entity.RouteDetail;
import java.util.UUID;

public interface RouteDetailRepository extends JpaRepository<RouteDetail, UUID> {
    // Thêm các phương thức tùy chỉnh nếu cần
}
