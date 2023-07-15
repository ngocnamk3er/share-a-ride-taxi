package openerp.containertransport.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "container_transport_trailers")
public class Trailer {
    @Id
    protected String uid;

    @GeneratedValue
    private Long id;

    @Column(name = "trailer_code")
    private String trailerCode;

    @ManyToOne()
    @JoinColumn(name = "facility_id", referencedColumnName = "uid")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Facility facility;

    @Column(name = "status")
    private String status;

    @ManyToOne()
    @JoinColumn(name = "truck_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Truck truck;

    @Column(name = "created_at")
    private long createdAt;

    @Column(name = "updated_at")
    private long updatedAt;
}
