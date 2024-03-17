package openerp.openerpresourceserver.service.Impl;


import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Driver;
import openerp.openerpresourceserver.repo.DriverRepository;
import openerp.openerpresourceserver.service.DriverService;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;

    @Override
    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    @Override
    public Driver getDriverById(UUID id) {
        return driverRepository.findById(id).orElse(null);
    }

    @Override
    public Driver saveDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    @Override
    public void deleteDriver(UUID id) {
        driverRepository.deleteById(id);
    }

    @Override
    public Driver updateDriver(UUID id, Driver driverRequest) {
        Driver driver = driverRepository.findById(id).orElseThrow();
        if (driverRequest.getGender() != null) {
            driver.setGender(driverRequest.getGender());
        }
        if (driverRequest.getEmail() != null) {
            driver.setEmail(driverRequest.getEmail());
        }
        if (driverRequest.getFullName() != null) {
            driver.setFullName(driverRequest.getFullName());
        }
        if (driverRequest.getPhoneNumber() != null) {
            driver.setPhoneNumber(driverRequest.getPhoneNumber());
        }
        if (driverRequest.getVehicleType() != null) {
            driver.setVehicleType(driverRequest.getVehicleType());
        }
        if (driverRequest.getVehicleLicensePlate() != null) {
            driver.setVehicleLicensePlate(driverRequest.getVehicleLicensePlate());
        }
        return driverRepository.save(driver);
    }
}