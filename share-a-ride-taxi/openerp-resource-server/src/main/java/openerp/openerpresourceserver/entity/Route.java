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
@Table(name = "sar_route")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "start_execute_stam")
    private LocalDateTime startExecutionStamp;

    @Column(name = "last_updated_stamp")
    private LocalDateTime lastUpdatedStamp;

    @Column(name = "created_stamp")
    private LocalDateTime createdStamp;

    @Column(name = "driver_id")
    private UUID driverId;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "area")
    private String area;

    // Thêm trường tọa độ lat
    @Column(name = "lat")
    private Double lat;

    // Thêm trường tọa độ lon
    @Column(name = "lon")
    private Double lon;
}
