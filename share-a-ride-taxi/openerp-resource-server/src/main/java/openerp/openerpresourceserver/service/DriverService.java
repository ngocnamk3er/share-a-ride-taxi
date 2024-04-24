package openerp.openerpresourceserver.service;


import openerp.openerpresourceserver.entity.Driver;

import java.util.List;
import java.util.UUID;

public interface DriverService {
    List<Driver> getAllDrivers();
    Driver getDriverById(UUID id);
    Driver saveDriver(Driver driver);
    void deleteDriver(UUID id);
    Driver updateDriver(UUID id, Driver driverRequest);

    Driver activateDriver(UUID id);
}