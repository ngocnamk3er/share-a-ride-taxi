package openerp.openerpresourceserver.controller;


import com.nimbusds.jose.shaded.gson.Gson;
import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.Driver;
import openerp.openerpresourceserver.model.request.DriverRequest;
import openerp.openerpresourceserver.service.Interface.DriverService;
import openerp.openerpresourceserver.service.Impl.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor(onConstructor_ = @Autowired)
@RequestMapping("/drivers")
@PreAuthorize("hasRole('default-roles-openerp-dev')")
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
    public ResponseEntity<Driver> createDriver(@RequestPart("driverInfo") String driverInfo,
                                                @RequestPart("avatarFile") MultipartFile avatarFile,
                                               @RequestPart("licensePhotoFile") MultipartFile licensePhotoFile,
                                               @RequestPart("vehiclePhotoFile") MultipartFile vehiclePhotoFile,
                                               @RequestPart("licensePlatePhotoFile") MultipartFile licensePlatePhotoFile) {
        System.out.println("driver");
        String avatarImageUrl = s3Service.uploadFile(avatarFile);
        String licensePhotoUrl = s3Service.uploadFile(licensePhotoFile);
        String vehiclePhotoUrl = s3Service.uploadFile(vehiclePhotoFile);
        String licensePlatePhotoUrl =  s3Service.uploadFile(licensePlatePhotoFile);
        Gson g = new Gson();
        DriverRequest driverRequest = g.fromJson(driverInfo, DriverRequest.class);

        Driver driver = Driver.builder()
                .avatarUrl(avatarImageUrl)
                .licensePhotoUrl(licensePhotoUrl)
                .vehiclePhotoUrl(vehiclePhotoUrl)
                .licensePlatePhotoUrl(licensePlatePhotoUrl)
                .fullName(driverRequest.getFullName())
                .address(driverRequest.getAddress())
                .lat(driverRequest.getLat())
                .lon(driverRequest.getLon())
                .phoneNumber(driverRequest.getPhoneNumber())
                .gender(driverRequest.getGender())
                .vehicleTypeId(driverRequest.getVehicleTypeId())
                .vehicleLicensePlate(driverRequest.getVehicleLicensePlate())
                .userId(driverRequest.getUserId())
                .build();

        System.out.println(driver);

        Driver savedDriver = driverService.saveDriver(driver);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDriver);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable String id, @RequestBody Driver driverRequest) {
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

    @GetMapping("/user/{userId}")
    public ResponseEntity<Driver> getDriverByUserId(@PathVariable String userId) {
        Driver driver = driverService.getDriverByUserId(userId);
        if (driver != null) {
            return ResponseEntity.ok().body(driver);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/{id}/activate")
    public ResponseEntity<Driver> activateDriver(@PathVariable UUID id) {
        Driver activatedDriver = driverService.activateDriver(id);
        return ResponseEntity.ok().body(activatedDriver);
    }
}
