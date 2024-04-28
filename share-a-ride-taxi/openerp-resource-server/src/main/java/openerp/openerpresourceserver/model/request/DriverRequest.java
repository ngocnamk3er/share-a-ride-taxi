package openerp.openerpresourceserver.model.request;

import jakarta.persistence.Column;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Data
public class DriverRequest {

    private String userId;
    private String fullName;
    private String phoneNumber;
    private String gender;
    private Integer vehicleTypeId;
    private String vehicleLicensePlate;
    private BigDecimal lat;
    private BigDecimal lon;
    private String address;
//    private MultipartFile avatarImage;
//    private MultipartFile vehiclePhoto;
//    private MultipartFile licensePhoto;
//    private MultipartFile licensePlatePhoto;


}