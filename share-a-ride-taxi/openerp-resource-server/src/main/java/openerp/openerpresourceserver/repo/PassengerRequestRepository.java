package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.PassengerRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface PassengerRequestRepository extends JpaRepository<PassengerRequest, UUID> {
}
