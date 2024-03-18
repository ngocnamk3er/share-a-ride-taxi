package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface LocationRepository extends JpaRepository<Location, UUID> {
    // Add custom query methods if needed
}
