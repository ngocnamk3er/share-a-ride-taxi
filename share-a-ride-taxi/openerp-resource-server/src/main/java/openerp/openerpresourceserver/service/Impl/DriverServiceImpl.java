package openerp.openerpresourceserver.service.Impl;


import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Driver;
import openerp.openerpresourceserver.enums.DriverStatus;
import openerp.openerpresourceserver.repo.DriverRepository;
import openerp.openerpresourceserver.service.DriverService;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
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
        LocalDateTime currentTime = LocalDateTime.now();
        driver.setCreatedAt(currentTime);
        driver.setUpdatedAt(currentTime);
        driver.setStatusId(DriverStatus.WAITING.ordinal());
        return driverRepository.save(driver);
    }

    @Override
    public void deleteDriver(UUID id) {
        driverRepository.deleteById(id);
    }

    @Override
    public Driver updateDriver(UUID id, Driver driverRequest) {
        Driver driver = driverRepository.findById(id).orElseThrow();
        if(driverRepository.existsById(id)){
            LocalDateTime currentTime = LocalDateTime.now();
            driverRequest.setUpdatedAt(currentTime);
            driverRequest.setCreatedAt(driver.getCreatedAt());
            driverRequest.setId(id);
            System.out.println("driverRequest");
            System.out.println(driverRequest);
            return driverRepository.save(driverRequest);
        }else{
            return null;
        }

    }

    @Override
    public Driver activateDriver(UUID id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Driver not found with ID: " + id));

        if (driver.getStatusId() == DriverStatus.WAITING.ordinal()) {
            driver.setStatusId(DriverStatus.ACTIVE.ordinal());
            return driverRepository.save(driver);
        } else {
            throw new IllegalStateException("Driver with ID " + id + " is not in waiting state");
        }
    }

    @Override
    public Driver getDriverByUserId(String userId) {
        return driverRepository.findByUserId(userId);
    }

    public boolean existsDriverByUserId(String userId) {
        return driverRepository.existsByUserId(userId);
    }
}