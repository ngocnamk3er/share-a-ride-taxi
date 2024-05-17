package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.DriverWarehouse;
import openerp.openerpresourceserver.repo.DriverWarehouseRepository;
import openerp.openerpresourceserver.service.Interface.DriverWarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DriverWarehouseServiceImpl implements DriverWarehouseService {

    private DriverWarehouseRepository repository;

    @Autowired
    public DriverWarehouseServiceImpl(DriverWarehouseRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<DriverWarehouse> getAllDriverWarehouses() {
        return repository.findAll();
    }

    @Override
    public DriverWarehouse getDriverWarehouseById(UUID driverId, String warehouseId) {
        Optional<DriverWarehouse> result = repository.findByDriverIdAndWarehouseId(driverId, warehouseId);
        return result.orElse(null);
    }

    @Override
    public DriverWarehouse createDriverWarehouse(DriverWarehouse driverWarehouse) {
        // Check if driverWarehouse with the same driverId and warehouseId exists
        Optional<DriverWarehouse> existing = repository.findByDriverIdAndWarehouseId(
                driverWarehouse.getDriverId(), driverWarehouse.getWarehouseId());

        if (existing.isPresent()) {
            // If exists, throw an exception or handle as per your application's requirements
            throw new IllegalArgumentException("DriverWarehouse already exists for driverId and warehouseId");
        }

        return repository.save(driverWarehouse);
    }

    @Override
    public void deleteDriverWarehouse(UUID driverId, String warehouseId) {
        repository.deleteByDriverIdAndWarehouseId(driverId, warehouseId);
    }

    @Override
    public DriverWarehouse activateDriverWarehouse(UUID driverId, String warehouseId) {
        Optional<DriverWarehouse> result = repository.findByDriverIdAndWarehouseId(driverId, warehouseId);
        if (!result.isPresent()) {
            throw new IllegalArgumentException("DriverWarehouse not found for driverId and warehouseId");
        }

        DriverWarehouse driverWarehouse = result.get();
        driverWarehouse.setActive(true);
        return repository.save(driverWarehouse);
    }
}
