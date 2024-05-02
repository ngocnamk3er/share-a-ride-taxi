package openerp.openerpresourceserver.repo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import openerp.openerpresourceserver.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DriverRepository extends JpaRepository<Driver, UUID> {
    Driver findByUserId(String userId);

    boolean existsByUserId(String userId);
}
