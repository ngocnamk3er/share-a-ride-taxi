package openerp.openerpresourceserver.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sar_route_pickup_detail")
public class RoutePickupDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "route_id")
    private String routeId;

    @Column(name = "request_id")
    private UUID requestId;

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