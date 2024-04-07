package openerp.openerpresourceserver.service.Impl;


import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Driver;
import openerp.openerpresourceserver.repo.DriverRepository;
import openerp.openerpresourceserver.service.DriverService;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
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
        LocalDateTime currentTime = LocalDateTime.now();
        driver.setCreatedAt(currentTime);
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
}