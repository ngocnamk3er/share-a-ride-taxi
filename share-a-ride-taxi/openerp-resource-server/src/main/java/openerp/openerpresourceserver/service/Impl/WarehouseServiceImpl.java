package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.Warehouse;
import openerp.openerpresourceserver.repo.WarehouseRepository;
import openerp.openerpresourceserver.service.Interface.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseServiceImpl implements WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Override
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    @Override
    public Warehouse getWarehouseById(String id) {
        return warehouseRepository.findById(id).orElse(null);
    }

    @Override
    public Warehouse saveWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    @Override
    public void deleteWarehouse(String id) {
        warehouseRepository.deleteById(id);
    }
}
