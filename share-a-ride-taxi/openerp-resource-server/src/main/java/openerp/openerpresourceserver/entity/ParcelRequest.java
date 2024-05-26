package openerp.openerpresourceserver.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sar_parcel_request")
public class ParcelRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "request_id")
    private UUID requestId;

    @Column(name = "sender_name", nullable = false, length = 100)
    private String senderName;

    @Column(name = "sender_phone_number", nullable = false, length = 20)
    private String senderPhoneNumber;

    @Column(name = "sender_email", length = 100)
    private String senderEmail;

    @Column(name = "recipient_name", nullable = false, length = 100)
    private String recipientName;

    @Column(name = "recipient_phone_number", nullable = false, length = 20)
    private String recipientPhoneNumber;

    @Column(name = "recipient_email", length = 100)
    private String recipientEmail;

    @Column(name = "request_time", nullable = false)
    private LocalDateTime requestTime;

    @Column(name = "status_id", nullable = false)
    private Integer statusId;

    @Column(name = "distance")
    private BigDecimal distance;


    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "pickup_latitude")
    private BigDecimal pickupLatitude;

    @Column(name = "pickup_longitude")
    private BigDecimal pickupLongitude;

    @Column(name = "pickup_address")
    private String pickupAddress;

    @Column(name = "dropoff_latitude")
    private BigDecimal dropoffLatitude;

    @Column(name = "dropoff_longitude")
    private BigDecimal dropoffLongitude;

    @Column(name = "dropoff_address")
    private String dropoffAddress;

    @Column(name = "created_by_user_login_id")
    private String createdByUserLoginId;

    @Column(name = "pickup_address_note")
    private String pickupAddressNote;

    @Column(name = "dropoff_address_note")
    private String dropoffAddressNote;

    @Column(name = "assigned_warehouse_id")
    private String assignedWarehouseId;

    @Column(name = "lat")
    private BigDecimal lat;

    @Column(name = "lon")
    private BigDecimal lon;

    @Column(name = "address")
    private String address;
    // Getters and setters
}
