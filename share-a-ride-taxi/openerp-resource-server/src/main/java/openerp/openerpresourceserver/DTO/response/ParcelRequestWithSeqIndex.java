package openerp.openerpresourceserver.DTO.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ParcelRequestWithSeqIndex {
    private UUID requestId;
    private String senderName;
    private String senderPhoneNumber;
    private String senderEmail;
    private String recipientName;
    private String recipientPhoneNumber;
    private String recipientEmail;
    private LocalDateTime requestTime;
    private Integer statusId;
    private BigDecimal distance;
    private LocalDateTime endTime;
    private BigDecimal pickupLatitude;
    private BigDecimal pickupLongitude;
    private String pickupAddress;
    private BigDecimal dropoffLatitude;
    private BigDecimal dropoffLongitude;
    private String dropoffAddress;
    private String createdByUserLoginId;
    private String pickupAddressNote;
    private String dropoffAddressNote;
    private String assignedWarehouseId;
    private BigDecimal lat;
    private BigDecimal lon;
    private String address;
    private int seqIndex;

    // Constructors, getters, and setters
}
