package openerp.openerpresourceserver.entity;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sar_route_warehouse_detail")
public class RouteWarehouseDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "route_id")
    private String routeId;

    @Column(name = "ware_house_id", nullable = false)
    private String warehouseId;

    @Column(name = "visited")
    private boolean visited;

    @Column(name = "seq_index")
    private Integer seqIndex;

    @Column(name = "last_updated_stamp")
    private LocalDateTime lastUpdatedStamp;

    @Column(name = "created_stamp")
    private LocalDateTime createdStamp;

    // Getters and setters
}
