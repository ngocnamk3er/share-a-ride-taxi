package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.entity.PassengerRequest;
import openerp.openerpresourceserver.service.Impl.GraphhopperService;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import openerp.openerpresourceserver.service.Impl.Object.RoutingEstimate;
import openerp.openerpresourceserver.service.ParcelRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import openerp.openerpresourceserver.service.PassengerRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/passenger-requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
public class PassengerRequestController {
    private final PassengerRequestService passengerRequestService;
    private final GraphhopperService graphhopperService;
    @GetMapping
    public List<PassengerRequest> getAllPassengerRequests() {
        return passengerRequestService.getAllPassengerRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PassengerRequest> getPassengerRequestById(@PathVariable UUID id) {
        PassengerRequest passengerRequest = passengerRequestService.getPassengerRequestById(id);
        return ResponseEntity.ok(passengerRequest);
    }

    @PostMapping
    public ResponseEntity<PassengerRequest> createPassengerRequest(@RequestBody PassengerRequest passengerRequest) {
        Coordinate pickup = new Coordinate(passengerRequest.getPickupLatitude(), passengerRequest.getDropoffLongitude());
        Coordinate dropoff =  new Coordinate(passengerRequest.getDropoffLatitude(), passengerRequest.getDropoffLongitude());
        RoutingEstimate routingEstimate = graphhopperService.getRoutingEstimate(pickup, dropoff);
        passengerRequest.setDistance(routingEstimate.getDistance());
        passengerRequest.setEndTime(passengerRequest.getRequestTime().plusSeconds(routingEstimate.getTime()/1000));
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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePassengerRequest(@PathVariable UUID id) {
        if (!passengerRequestService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        passengerRequestService.deletePassengerRequest(id);
        return ResponseEntity.noContent().build();
    }
}
