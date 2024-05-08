package openerp.openerpresourceserver.entity;

import jakarta.persistence.*;
import lombok.*;

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
    private Double distance;


    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "pickup_latitude")
    private Double pickupLatitude;

    @Column(name = "pickup_longitude")
    private Double pickupLongitude;

    @Column(name = "pickup_address")
    private String pickupAddress;

    @Column(name = "dropoff_latitude")
    private Double dropoffLatitude;

    @Column(name = "dropoff_longitude")
    private Double dropoffLongitude;

    @Column(name = "dropoff_address")
    private String dropoffAddress;

    @Column(name = "created_by_user_login_id")
    private String createdByUserLoginId;

    @Column(name = "location_note")
    private String locationNote;
    // Getters and setters
}
