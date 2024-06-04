package openerp.openerpresourceserver.controller;

import com.graphhopper.ResponsePath;
import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.PassengerRequest;
import openerp.openerpresourceserver.enums.RequestStatus;
import openerp.openerpresourceserver.enums.RequestType;
import openerp.openerpresourceserver.enums.RouteType;
import openerp.openerpresourceserver.service.Interface.GraphHopperCalculator;
import openerp.openerpresourceserver.service.Impl.GraphhopperService;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import openerp.openerpresourceserver.service.Impl.Object.RoutingEstimate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import openerp.openerpresourceserver.service.Interface.PassengerRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/passenger-requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('default-roles-openerp-dev')")
public class PassengerRequestController {
    private final PassengerRequestService passengerRequestService;
    private final GraphhopperService graphhopperService;
    private final GraphHopperCalculator graphHopperCalculator;
    @GetMapping
    public List<PassengerRequest> getAllPassengerRequests() {
        return passengerRequestService.getAllPassengerRequests();
    }

    @GetMapping("/get-by-route-id/{routeId}")
    public ResponseEntity<List<PassengerRequest>> getPassengerRequestById(@PathVariable String routeId) {
        List<PassengerRequest> passengerRequests = passengerRequestService.getPassengerRequestByRouteId(routeId);
        return ResponseEntity.ok(passengerRequests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PassengerRequest> getPassengerRequestById(@PathVariable UUID id) {
        PassengerRequest passengerRequest = passengerRequestService.getPassengerRequestById(id);
        return ResponseEntity.ok(passengerRequest);
    }

    @PostMapping
    public ResponseEntity<PassengerRequest> createPassengerRequest(@RequestBody PassengerRequest passengerRequest) throws Exception {
        Coordinate start = new Coordinate(passengerRequest.getPickupLatitude(), passengerRequest.getDropoffLongitude());
        Coordinate end =  new Coordinate(passengerRequest.getDropoffLatitude(), passengerRequest.getDropoffLongitude());
        ResponsePath path = graphHopperCalculator.calculate(start, end);
        passengerRequest.setDistance(BigDecimal.valueOf(path.getDistance()));
        passengerRequest.setEndTime(passengerRequest.getRequestTime().plusSeconds(path.getTime()/1000));
        PassengerRequest createdPassengerRequest = passengerRequestService.savePassengerRequest(passengerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPassengerRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PassengerRequest> updatePassengerRequest(@PathVariable UUID id, @RequestBody PassengerRequest passengerRequest) {
        if (!passengerRequestService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Coordinate pickup = new Coordinate(passengerRequest.getPickupLatitude(), passengerRequest.getDropoffLongitude());
        Coordinate dropoff =  new Coordinate(passengerRequest.getDropoffLatitude(), passengerRequest.getDropoffLongitude());
        RoutingEstimate routingEstimate = graphhopperService.getRoutingEstimate(pickup, dropoff);
        passengerRequest.setDistance(routingEstimate.getDistance());
        passengerRequest.setEndTime(passengerRequest.getRequestTime().plusSeconds(routingEstimate.getTime()/1000));
        passengerRequest.setRequestId(id);
        PassengerRequest updatedPassengerRequest = passengerRequestService.savePassengerRequest(passengerRequest);
        return ResponseEntity.ok(updatedPassengerRequest);
    }

    @PutMapping("/add-to-route/{routeId}")
    public ResponseEntity<List<PassengerRequest>> addPassengerRequestsToRoute(@PathVariable String routeId, @RequestBody List<PassengerRequest> passengerRequests) {
        List<PassengerRequest> passengerRequestList = passengerRequestService.getPassengerRequestByRouteId(routeId);

        for (PassengerRequest passengerRequest : passengerRequestList){
            passengerRequest.setRouteId(null);
            passengerRequest.setRouteType(null);
            passengerRequest.setSeqIndex(null);
            passengerRequest.setStatusId(RequestStatus.RECEIVED.ordinal());
            passengerRequestService.savePassengerRequest(passengerRequest);
        }

        for (PassengerRequest passengerRequest : passengerRequests) {
            PassengerRequest existPassengerRequest = passengerRequestService.getPassengerRequestById(passengerRequest.getRequestId());
            if (existPassengerRequest == null) {
                return ResponseEntity.notFound().build();
            }
            existPassengerRequest.setRouteType(passengerRequest.getRouteType());
            existPassengerRequest.setRouteId(routeId);
            existPassengerRequest.setSeqIndex(passengerRequest.getSeqIndex());
            existPassengerRequest.setStatusId(RequestStatus.DRIVER_ASSIGNED.ordinal());
            passengerRequestService.savePassengerRequest(existPassengerRequest);
        }
        return ResponseEntity.ok(passengerRequests);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassengerRequest(@PathVariable UUID id) {
        if (!passengerRequestService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        passengerRequestService.deletePassengerRequest(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/update-visited/{requestId}")
    public ResponseEntity<PassengerRequest> updateVisited(@PathVariable UUID requestId, @RequestParam Boolean visited) {
        // Kiểm tra xem yêu cầu hành khách có tồn tại hay không
        PassengerRequest passengerRequest = passengerRequestService.getPassengerRequestById(requestId);
        if (passengerRequest == null) {
            return ResponseEntity.notFound().build();
        }

        // Cập nhật trạng thái visited
        passengerRequest.setVisited(visited);

        // Lưu lại thay đổi
        PassengerRequest updatedPassengerRequest = passengerRequestService.savePassengerRequest(passengerRequest);
        return ResponseEntity.ok(updatedPassengerRequest);
    }

}
