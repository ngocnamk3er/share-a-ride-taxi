package openerp.openerpresourceserver.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @Column(name = "driver_id", nullable = false)
    private UUID driverId;

    @Column(name = "warehouse_id", nullable = false)
    private String warehouseId;

    @Column(name = "joining_date", nullable = false)
    private LocalDateTime joiningDate;

    @Column(name = "active")
    private boolean active;

    // Getters and Setters
}
