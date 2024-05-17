package openerp.openerpresourceserver.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.Date;

/**
 * Contains information about menu and screen permissions
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sar_entity_authorization")
public class EntityAuthorization {

    @Id
    private String id;

    // User's role
    private String roleId;

    private String description;

    @LastModifiedDate
    private Date lastUpdated;

    @CreatedDate
    private Date created;

}
