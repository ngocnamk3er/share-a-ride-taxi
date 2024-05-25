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
@Table(name = "sar_passenger_request")
public class PassengerRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "request_id")
    private UUID requestId;

    @Column(name = "passenger_name", nullable = false)
    private String passengerName;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "email")
    private String email;

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

    @Column(name = "pickup_address_note")
    private String pickupAddressNote;

    @Column(name = "dropoff_address_note")
    private String dropoffAddressNote;

    @Column(name = "route_id")
    private String routeId;

    @Column(name = "route_type")
    private String routeType;

    @Column(name = "pick_up_seq_index")
    private Integer pickUpSeqIndex;

    @Column(name = "drop_off_seq_index")
    private Integer dropOffSeqIndex;

    @Column(name = "lat")
    private Double lat;

    @Column(name = "lon")
    private Double lon;

    @Column(name = "address")
    private String address;

    // Getters and setters
}




