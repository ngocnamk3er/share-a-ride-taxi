package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.Warehouse;

import java.util.List;

public interface WarehouseService {
    List<Warehouse> getAllWarehouses();
    Warehouse getWarehouseById(String id);
    Warehouse saveWarehouse(Warehouse warehouse);
    void deleteWarehouse(String id);

    List<Warehouse> getWarehouseByWarehoueRouteId(String id);
}
