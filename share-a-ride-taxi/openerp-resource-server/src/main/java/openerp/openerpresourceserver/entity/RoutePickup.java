package openerp.openerpresourceserver.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@Builder
@Table(name = "sar_route_pickup")
public class RoutePickup {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "driver_id")
    private UUID driverId;

    @Column(name = "start_execute_stamp")
    private LocalDateTime startExecuteStamp;

    @Column(name = "last_updated_stamp")
    private LocalDateTime lastUpdatedStamp;

    @Column(name = "created_stamp")
    private LocalDateTime createdStamp;

    @Column(name = "end_stamp")
    private LocalDateTime endStamp;

    @Column(name = "route_status_id")
    private Integer routeStatusId;

    @Column(name = "ware_house_id")
    private String wareHouseId;

}