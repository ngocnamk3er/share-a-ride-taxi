package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, String> {
    @Query("SELECT w.warehouseId, w.warehouseName, w.address, w.addressNote, w.lat, w.lon, " +
            "w.createdAt, w.updatedAt, w.createdByUserId, rwd.visited, rwd.seqIndex , rwd.id " +
            "FROM Warehouse w " +
            "INNER JOIN RouteWarehouseDetail rwd ON w.warehouseId = rwd.warehouseId " +
            "INNER JOIN RouteWarehouse rw ON rw.id = rwd.routeId " +
            "WHERE rw.id = :routeId " +
            "ORDER BY rwd.seqIndex ASC")
    List<Object[]> getWarehouseByWarehoueRouteId(@Param("routeId") String id);
}