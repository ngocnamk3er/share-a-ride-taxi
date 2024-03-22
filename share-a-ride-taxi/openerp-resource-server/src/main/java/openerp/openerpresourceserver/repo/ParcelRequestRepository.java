package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.ParcelRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ParcelRequestRepository extends JpaRepository<ParcelRequest, UUID> {
    // Các phương thức truy vấn cụ thể có thể được thêm vào đây nếu cần
}
