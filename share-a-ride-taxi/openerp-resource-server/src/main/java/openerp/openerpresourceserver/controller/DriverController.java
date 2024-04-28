package openerp.openerpresourceserver.controller;


import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Driver;
import openerp.openerpresourceserver.model.request.DriverRequest;
import openerp.openerpresourceserver.service.DriverService;
import openerp.openerpresourceserver.service.Impl.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/drivers")
@PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
public class DriverController {

    private final DriverService driverService;
    private final S3Service s3Service;

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        List<Driver> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok().body(drivers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable UUID id) {
        Driver driver = driverService.getDriverById(id);
        if (driver != null) {
            return ResponseEntity.ok().body(driver);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestPart("avatarFile") MultipartFile avatarFile,
                                               @RequestPart("licensePhotoFile") MultipartFile licensePhotoFile,
                                               @RequestPart("vehiclePhotoFile") MultipartFile vehiclePhotoFile,
                                               @RequestPart("licensePlatePhotoFile") MultipartFile licensePlatePhotoFile) {
        String avatarImageUrl = s3Service.uploadFile(avatarFile);
        String licensePhotoUrl = s3Service.uploadFile(licensePhotoFile);
        String vehiclePhotoUrl = s3Service.uploadFile(vehiclePhotoFile);
        String licensePlatePhotoUrl =  s3Service.uploadFile(licensePlatePhotoFile);

        Driver driver = Driver.builder()
                .avatarUrl(avatarImageUrl)
                .licensePhotoUrl(licensePhotoUrl)
                .vehiclePhotoUrl(vehiclePhotoUrl)
                .licensePlatePhotoUrl(licensePlatePhotoUrl)
                .fullName("Xuân Thành")
                .address("Bắc Giang")
                .lat(BigDecimal.valueOf(21.3169625))
                .lon(BigDecimal.valueOf(106.437985))
                .phoneNumber(String.valueOf(123456789))
                .build();

        Driver savedDriver = driverService.saveDriver(driver);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDriver);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable UUID id, @RequestBody Driver driverRequest) {
        Driver updatedDriver = driverService.updateDriver(id, driverRequest);
        return ResponseEntity.ok().body(updatedDriver);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDriver(@PathVariable UUID id) {
        try {
            driverService.deleteDriver(id);
            return ResponseEntity.ok().body("Driver with ID " + id + " has been deleted successfully");
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete driver", e);
        }
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<Driver> activateDriver(@PathVariable UUID id) {
        Driver activatedDriver = driverService.activateDriver(id);
        return ResponseEntity.ok().body(activatedDriver);
    }
}
