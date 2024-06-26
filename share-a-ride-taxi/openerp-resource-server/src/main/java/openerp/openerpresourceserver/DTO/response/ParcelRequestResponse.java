package openerp.openerpresourceserver.DTO.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ParcelRequestResponse {
    private UUID id;
    private String senderName;
    private String senderPhoneNumber;
    private String senderEmail;
    private String recipientName;
    private String recipientPhoneNumber;
    private String recipientEmail;
    private LocalDateTime requestTime;
    private BigDecimal pickupLocationLatitude;
    private BigDecimal pickupLocationLongitude;
    private String pickupLocationAddress;
    private BigDecimal dropoffLocationLatitude;
    private BigDecimal dropoffLocationLongitude;
    private String dropoffLocationAddress;
    private String requestStatus;
}
