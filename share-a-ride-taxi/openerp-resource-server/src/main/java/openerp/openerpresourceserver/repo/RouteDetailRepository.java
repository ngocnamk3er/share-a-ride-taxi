package openerp.openerpresourceserver.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import openerp.openerpresourceserver.entity.RouteDetail;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface RouteDetailRepository extends JpaRepository<RouteDetail, UUID> {
    // Thêm các phương thức tùy chỉnh nếu cần
    @Query("SELECT rd FROM RouteDetail rd WHERE " +
            "(:routeId is null OR rd.routeId = :routeId)")
    List<RouteDetail> search(@Param("routeId") UUID routeId);

    void deleteByRouteId(UUID routeId);
}
