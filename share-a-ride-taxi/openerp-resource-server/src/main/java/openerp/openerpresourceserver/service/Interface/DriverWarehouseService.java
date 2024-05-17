package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.DriverWarehouse;

import java.util.UUID;
import java.util.List;

public interface DriverWarehouseService {

    List<DriverWarehouse> getAllDriverWarehouses();

    DriverWarehouse getDriverWarehouseById(UUID driverId, String warehouseId);

    DriverWarehouse createDriverWarehouse(DriverWarehouse driverWarehouse);

    void deleteDriverWarehouse(UUID driverId, String warehouseId);

    DriverWarehouse activateDriverWarehouse(UUID driverId, String warehouseId);
}
