package openerp.openerpresourceserver.entity;

import jakarta.persistence.*;
import lombok.*;
import openerp.openerpresourceserver.enums.RequestType;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sar_route_detail")
public class RouteDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "route_id")
    private UUID routeId;

    @Column(name = "request_type")
    private String requestType;

    @Column(name = "request_id")
    private UUID requestId;

    @Column(name = "is_pickup")
    private Boolean isPickup;

    @Column(name = "seq_index")
    private Integer seqIndex;

    @Column(name = "last_updated_stamp")
    private LocalDateTime lastUpdatedStamp;

    @Column(name = "created_stamp")
    private LocalDateTime createdStamp;

    // Getters and setters
}
