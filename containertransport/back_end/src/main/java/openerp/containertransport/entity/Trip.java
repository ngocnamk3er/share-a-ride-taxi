package openerp.containertransport.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "container_transport_trip")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;

    @Column(name = "uid")
    private String uid;

    private String code;

    @ManyToOne()
    @JoinColumn(name = "truck_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Truck truck;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinTable(	name = "container_transport_trip_order",
            joinColumns = @JoinColumn(name = "trip_id"),
            inverseJoinColumns = @JoinColumn(name = "order_id"))
    private List<Order> orders = new ArrayList<>();

    @Column(name = "created_by_user_id")
    private String createdByUserId;

    @ManyToOne()
    @JoinColumn(name = "shipment_id", referencedColumnName = "uid")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Shipment shipment;

    @Column(name = "status")
    private String status;

    @Column(name = "driver_id")
    private String driverId;

    @Column(name = "total_distant")
    private BigDecimal totalDistant;

    @Column(name = "total_time")
    private BigDecimal totalTime;

    @Column(name = "created_at")
    private long createdAt;

    @Column(name = "updated_at")
    private long updatedAt;
}
