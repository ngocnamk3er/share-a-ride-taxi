package openerp.openerpresourceserver.repo;

import openerp.openerpresourceserver.DTO.response.ParcelRequestWithSeqIndex;
import openerp.openerpresourceserver.entity.ParcelRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ParcelRequestRepository extends JpaRepository<ParcelRequest, UUID> {

    @Query(value = "SELECT pr.request_id, pr.sender_name, pr.sender_phone_number, pr.sender_email, pr.recipient_name, " +
            "pr.recipient_phone_number, pr.recipient_email, pr.request_time, pr.status_id, pr.distance, " +
            "pr.end_time, pr.pickup_latitude, pr.pickup_longitude, pr.pickup_address, pr.dropoff_latitude, " +
            "pr.dropoff_longitude, pr.dropoff_address, pr.created_by_user_login_id, pr.pickup_address_note, " +
            "pr.dropoff_address_note, pr.assigned_warehouse_id, pr.lat, pr.lon, pr.address, rpd.seq_index " +
            "FROM sar_parcel_request pr " +
            "INNER JOIN sar_route_pickup_detail rpd ON pr.request_id = rpd.request_id " +
            "INNER JOIN sar_route_pickup rp ON rp.id = rpd.route_id " +
            "WHERE rp.id = :pickUpRouteId " +
            "ORDER BY rpd.seq_index", nativeQuery = true)
    List<Object[]> getParcelRequesByPickUpRoute(@Param("pickUpRouteId") String pickUpRouteId);



    @Query(value = "SELECT pr.* FROM sar_parcel_request pr " +
            "INNER JOIN sar_route_dropoff_detail rdd ON pr.request_id = rdd.request_id " +
            "INNER JOIN sar_route_dropoff rd ON rd.id = rdd.route_id " +
            "WHERE rd.id = :dropOffRouteId " +
            "ORDER BY rdd.seq_index", nativeQuery = true)
    List<ParcelRequest> getParcelRequesByDropOffRoute(@Param("dropOffRouteId") String id);
}

