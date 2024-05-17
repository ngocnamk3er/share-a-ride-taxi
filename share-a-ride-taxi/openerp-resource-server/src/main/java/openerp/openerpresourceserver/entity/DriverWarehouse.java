package openerp.openerpresourceserver.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sar_driver_warehouse")
public class DriverWarehouse {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "driver_id", nullable = false)
    private String driverId;

    @Column(name = "warehouse_id", nullable = false)
    private String warehouseId;

    @Column(name = "joining_date", nullable = false)
    private LocalDateTime joiningDate;

    @Column(name = "active")
    private boolean active;

    // Getters and Setters
}

