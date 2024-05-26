package openerp.openerpresourceserver.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PassengerRequestResponse {
    private UUID id;
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
    private String requestStatus;

}
