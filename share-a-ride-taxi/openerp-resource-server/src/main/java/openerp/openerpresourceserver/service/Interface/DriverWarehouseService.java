package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.DriverWarehouse;

import java.util.UUID;
import java.util.List;

public interface DriverWarehouseService {

    List<DriverWarehouse> getAllDriverWarehouses();

    DriverWarehouse getDriverWarehouseById(String driverId, String warehouseId);

    DriverWarehouse createDriverWarehouse(DriverWarehouse driverWarehouse);

    void deleteDriverWarehouse(String driverId, String warehouseId);

    DriverWarehouse activateDriverWarehouse(String driverId, String warehouseId);

    List<DriverWarehouse> getDriverWarehouseByDriverId(String driverId);

    List<DriverWarehouse> getDriverWarehouseByWarehouseId(String warehouseId);
}
