package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.DriverWarehouse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DriverWarehouseRepository extends JpaRepository<DriverWarehouse, UUID> {
    void deleteByDriverIdAndWarehouseId(String driverId, String warehouseId);

    Optional<DriverWarehouse> findByDriverIdAndWarehouseId(String driverId, String warehouseId);

    List<DriverWarehouse> getDriverWarehouseByWarehouseId(String warehouseId);


    List<DriverWarehouse> findByDriverId(String driverId);
}