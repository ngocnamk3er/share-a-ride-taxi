package openerp.openerpresourceserver.DTO.request;

import lombok.Data;

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
}