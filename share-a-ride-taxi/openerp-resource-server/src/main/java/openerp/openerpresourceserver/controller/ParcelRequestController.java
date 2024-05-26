package openerp.openerpresourceserver.controller;

import com.graphhopper.ResponsePath;
import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.DTO.response.ParcelRequestWithSeqIndex;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.service.Interface.GraphHopperCalculator;
import openerp.openerpresourceserver.service.Impl.GraphhopperService;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import openerp.openerpresourceserver.service.Impl.Object.RoutingEstimate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import openerp.openerpresourceserver.service.Interface.ParcelRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/parcel-requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('default-roles-openerp-dev')")
public class ParcelRequestController {
    private final ParcelRequestService parcelRequestService;
    private final GraphhopperService graphhopperService;
    private final GraphHopperCalculator graphHopperCalculator;
    @GetMapping
    public List<ParcelRequest> getAllParcelRequests() {
        return parcelRequestService.getAllParcelRequests();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ParcelRequest> getParcelRequestById(@PathVariable UUID id) {
        ParcelRequest parcelRequest = parcelRequestService.getParcelRequestById(id);
        return ResponseEntity.ok(parcelRequest);
    }

    @GetMapping("/by-pickup-route/{id}")
    public List<ParcelRequestWithSeqIndex> getParcelRequestByPickUpRouteId(@PathVariable String id) {
        return parcelRequestService.getParcelRequestByPickUpRouteId(id);
    }

    @GetMapping("/by-drop-off-route/{id}")
    public List<ParcelRequest> getParcelRequestByDropOffRouteId(@PathVariable String id) {
        return parcelRequestService.getParcelRequestByDropOffRouteId(id);
    }

    @PostMapping
    public ResponseEntity<ParcelRequest> createParcelRequest(@RequestBody ParcelRequest parcelRequest) throws Exception {
        Coordinate start = new Coordinate(parcelRequest.getPickupLatitude(), parcelRequest.getPickupLongitude());
        Coordinate end =  new Coordinate(parcelRequest.getDropoffLatitude(), parcelRequest.getDropoffLongitude());
        ResponsePath path = graphHopperCalculator.calculate(start, end);
        parcelRequest.setDistance(BigDecimal.valueOf(path.getDistance()));
        parcelRequest.setEndTime(parcelRequest.getRequestTime().plusSeconds(path.getTime()/1000));
        ParcelRequest createdParcelRequest = parcelRequestService.createParcelRequest(parcelRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdParcelRequest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ParcelRequest> updateParcelRequest(@PathVariable UUID id, @RequestBody ParcelRequest parcelRequest) {
        if (!parcelRequestService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Coordinate pickup = new Coordinate(parcelRequest.getPickupLatitude(), parcelRequest.getDropoffLongitude());
        Coordinate dropoff =  new Coordinate(parcelRequest.getDropoffLatitude(), parcelRequest.getDropoffLongitude());
        RoutingEstimate routingEstimate = graphhopperService.getRoutingEstimate(pickup, dropoff);
        parcelRequest.setDistance(routingEstimate.getDistance());
        parcelRequest.setEndTime(parcelRequest.getRequestTime().plusSeconds(routingEstimate.getTime()/1000));
        ParcelRequest createdParcelRequest = parcelRequestService.createParcelRequest(parcelRequest);
        parcelRequest.setRequestId(id);
        ParcelRequest updatedParcelRequest = parcelRequestService.createParcelRequest(parcelRequest);
        return ResponseEntity.ok(updatedParcelRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcelRequest(@PathVariable UUID id) {
        if (!parcelRequestService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        parcelRequestService.deleteParcelRequest(id);
        return ResponseEntity.noContent().build();
    }
}