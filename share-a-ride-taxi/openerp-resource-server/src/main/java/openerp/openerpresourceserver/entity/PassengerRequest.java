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

    @Column(name = "pickup_location_id", nullable = false)
    private UUID pickupLocationId;

    @Column(name = "dropoff_location_id", nullable = false)
    private UUID dropoffLocationId;

    @Column(name = "request_time", nullable = false)
    private LocalDateTime requestTime;

    @Column(name = "status_id", nullable = false)
    private Integer statusId;

    // Getters and setters
}




