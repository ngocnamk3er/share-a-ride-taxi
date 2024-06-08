package openerp.openerpresourceserver.controller;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.entity.RouteDropoffDetail;
import openerp.openerpresourceserver.enums.RequestStatus;
import openerp.openerpresourceserver.service.Interface.ParcelRequestService;
import openerp.openerpresourceserver.service.Interface.RouteDropoffDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/route-dropoff-details")
@AllArgsConstructor
public class RouteDropoffDetailController {

    private final ParcelRequestService parcelRequestService;

    private final RouteDropoffDetailService routeDropoffDetailService;

    // API to get all RouteDropoffDetail by routeId
    @GetMapping("/by-route/{routeId}")
    public ResponseEntity<List<RouteDropoffDetail>> getAllByRouteId(@PathVariable String routeId) {
        List<RouteDropoffDetail> routeDropoffDetails = routeDropoffDetailService.findAllByRouteId(routeId);
        return ResponseEntity.ok().body(routeDropoffDetails);
    }

    // API to create a new RouteDropoffDetail
    @PostMapping("")
    public ResponseEntity<RouteDropoffDetail> create(@RequestBody RouteDropoffDetail routeDropoffDetail) {
        RouteDropoffDetail createdRouteDropoffDetail = routeDropoffDetailService.createRouteDropoffDetail(routeDropoffDetail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdRouteDropoffDetail);
    }

    // API to update an existing RouteDropoffDetail
    @PutMapping("/{id}")
    public ResponseEntity<RouteDropoffDetail> update(@PathVariable UUID id, @RequestBody RouteDropoffDetail routeDropoffDetail) {
        RouteDropoffDetail updatedRouteDropoffDetail = routeDropoffDetailService.updateRouteDropoffDetail(id, routeDropoffDetail);
        if (updatedRouteDropoffDetail != null) {
            return ResponseEntity.ok().body(updatedRouteDropoffDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // API to delete a RouteDropoffDetail by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable UUID id) {
        routeDropoffDetailService.deleteRouteDropoffDetail(id);
        return ResponseEntity.noContent().build();
    }

    // API to update visited status by routeId and requestId
    @PutMapping("/visited")
    public ResponseEntity<RouteDropoffDetail> updateVisitedStatus(
            @RequestParam String routeId,
            @RequestParam UUID requestId,
            @RequestParam boolean visited) {
        RouteDropoffDetail updatedRouteDropoffDetail = routeDropoffDetailService.updateVisitedStatus(routeId, requestId, visited);
        ParcelRequest parcelRequest = parcelRequestService.getParcelRequestById(requestId);
        parcelRequest.setStatusId(RequestStatus.DELIVERED.ordinal());
        parcelRequestService.createParcelRequest(parcelRequest);
        if (updatedRouteDropoffDetail != null) {
            return ResponseEntity.ok().body(updatedRouteDropoffDetail);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
