package openerp.openerpresourceserver.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sar_drivers")
public class Driver {
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;

    @Column(name = "gender")
    private String gender;

    @Column(name = "vehicle_type_id")
    private Integer vehicleTypeId;

    @Column(name = "vehicle_license_plate")
    private String vehicleLicensePlate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "lat")
    private BigDecimal lat;

    @Column(name = "lon")
    private BigDecimal lon;

    @Column(name = "address")
    private String address;

    @Column(name = "address_note")
    private String addressNote;

    @Column(name = "status_id")
    private Integer statusId;

    @Id
    @Column(name = "user_id")
    private String userId;

    @Column(name = "payload_capacity")
    private BigDecimal payloadCapacity;

    @Column(name = "seating_capacity")
    private BigDecimal seatingCapacity;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "vehicle_photo_url")
    private String vehiclePhotoUrl;

    @Column(name = "license_photo_url")
    private String licensePhotoUrl;

    @Column(name = "license_plate_photo_url")
    private String licensePlatePhotoUrl;

}