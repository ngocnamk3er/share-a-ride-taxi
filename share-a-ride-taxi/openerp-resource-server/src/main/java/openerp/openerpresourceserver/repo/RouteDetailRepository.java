package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import openerp.openerpresourceserver.entity.RouteDetail;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface RouteDetailRepository extends JpaRepository<RouteDetail, UUID> {
    // Thêm các phương thức tùy chỉnh nếu cần
    List<RouteDetail> findByRouteId(UUID routeId);
    void deleteByRouteId(UUID routeId);

}
