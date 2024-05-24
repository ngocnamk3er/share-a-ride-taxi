package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.entity.ParcelRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ParcelRequestRepository extends JpaRepository<ParcelRequest, UUID> {

    @Query(value = "SELECT pr.* FROM sar_parcel_request pr " +
            "INNER JOIN sar_route_pickup_detail rpd ON pr.request_id = rpd.request_id " +
            "INNER JOIN sar_route_pickup rp ON rp.id = rpd.route_id " +
            "WHERE rp.id = :pickUpRouteId", nativeQuery = true)
    List<ParcelRequest> getParcelRequesByPickUpRoute(@Param("pickUpRouteId") String pickUpRouteId);

    @Query(value = "SELECT pr.* FROM sar_parcel_request pr " +
            "INNER JOIN sar_route_dropoff_detail rdd ON pr.request_id = rdd.request_id " +
            "INNER JOIN sar_route_dropoff rd ON rd.id = rdd.route_id " +
            "WHERE rd.id = :dropOffRouteId", nativeQuery = true)
    List<ParcelRequest> getParcelRequesByDropOffRoute(@Param("dropOffRouteId") String id);
}

