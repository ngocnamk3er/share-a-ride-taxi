package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.PassengerRequest;
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
        PassengerRequest createdPassengerRequest = passengerRequestService.savePassengerRequest(passengerRequest);
        System.out.println("passengerRequest");
        System.out.println(passengerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPassengerRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PassengerRequest> updatePassengerRequest(@PathVariable UUID id, @RequestBody PassengerRequest passengerRequest) {
        if (!passengerRequestService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
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
