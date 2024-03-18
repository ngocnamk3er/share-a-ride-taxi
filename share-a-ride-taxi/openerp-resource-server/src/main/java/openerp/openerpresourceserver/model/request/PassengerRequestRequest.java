package openerp.openerpresourceserver.model.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PassengerRequestRequest {
    private String passengerName;
    private String phoneNumber;
    private String email;
    private BigDecimal pickupLocationLatitude;
    private BigDecimal pickupLocationLongitude;
    private String pickupLocationAddress;
    private BigDecimal dropoffLocationLatitude;
    private BigDecimal dropoffLocationLongitude;
    private String dropoffLocationAddress;
    private LocalDateTime requestTime;
    private Integer statusId;
}
