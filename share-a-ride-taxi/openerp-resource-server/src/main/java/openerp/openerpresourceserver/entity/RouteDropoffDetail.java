package openerp.openerpresourceserver.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;


@Entity
@Data
@Table(name = "route_dropoff_detail")
public class RouteDropoffDetail{
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "route_id")
    private String routeId;

    @Column(name = "request_id", nullable = false)
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
