package openerp.openerpresourceserver.controller;


import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Driver;
import openerp.openerpresourceserver.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/drivers")
public class DriverController {

    private final DriverService driverService;


    @GetMapping
//    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    public ResponseEntity<List<Driver>> getAllDrivers() {
        List<Driver> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok().body(drivers);
    }

    @GetMapping("/{id}")
//    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    public ResponseEntity<Driver> getDriverById(@PathVariable UUID id) {
        Driver driver = driverService.getDriverById(id);
        if (driver != null) {
            return ResponseEntity.ok().body(driver);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
//    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    public ResponseEntity<Driver> createDriver(@RequestBody Driver driver) {
        Driver savedDriver = driverService.saveDriver(driver);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDriver);
    }

    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    public ResponseEntity<Driver> updateDriver(@PathVariable UUID id, @RequestBody Driver driverRequest) {
        Driver updatedDriver = driverService.updateDriver(id, driverRequest);
        return ResponseEntity.ok().body(updatedDriver);
    }


    @DeleteMapping("/{id}")
//    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    public ResponseEntity<String> deleteDriver(@PathVariable UUID id) {
        try {
            driverService.deleteDriver(id);
            return ResponseEntity.ok().body("Driver with ID " + id + " has been deleted successfully");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete driver", e);
        }
    }
}
