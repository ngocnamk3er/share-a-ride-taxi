package openerp.openerpresourceserver.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sar_warehouse")
public class Warehouse {

    @Id
    @Column(name = "warehouse_id")
    private String warehouseId;

    @Column(name = "warehouse_name", nullable = false)
    private String warehouseName;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "address_note")
    private String addressNote;

    @Column(name = "latitude")
    private Double lat;

    @Column(name = "longitude")
    private Double lon;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_by_user_id")
    private String createdByUserId;
    // Getters and setters
}
