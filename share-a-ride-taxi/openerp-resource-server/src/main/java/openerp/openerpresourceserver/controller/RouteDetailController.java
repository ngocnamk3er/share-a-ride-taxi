package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.enums.RequestType;
import openerp.openerpresourceserver.service.ParcelRequestService;
import openerp.openerpresourceserver.service.PassengerRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import openerp.openerpresourceserver.entity.RouteDetail;
import openerp.openerpresourceserver.service.RouteDetailService;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/route-details")
@PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
public class RouteDetailController {

    private final ParcelRequestService parcelRequestService;

    private final PassengerRequestService passengerRequestService;
    private final RouteDetailService routeDetailService;

    @GetMapping
    public ResponseEntity<List<RouteDetail>> getAllRouteDetails() {
        List<RouteDetail> routeDetails = routeDetailService.getAllRouteDetails();
        return new ResponseEntity<>(routeDetails, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RouteDetail> getRouteDetailById(@PathVariable("id") UUID id) {
        RouteDetail routeDetail = routeDetailService.getRouteDetailById(id);
        if (routeDetail != null) {
            return new ResponseEntity<>(routeDetail, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createRouteDetail(@RequestBody RouteDetail routeDetail) {
        // Kiểm tra nếu requestType là "parcel" và không tồn tại trong sar_parcel_request
        String requestType = routeDetail.getRequestType();
        UUID requestId = routeDetail.getRequestId();
        if (!"parcel".equals(requestType) && !"passenger".equals(requestType)){
            return new ResponseEntity<>("\"Invalid request type\"",HttpStatus.BAD_REQUEST);
        }

        if ("parcel".equals(requestType) && !parcelRequestService.existsById(requestId)) {
            return new ResponseEntity<>("\"Parcel request not found\"",HttpStatus.BAD_REQUEST);
        }

        // Kiểm tra nếu requestType là "passenger" và không tồn tại trong sar_passenger_request
        if ("passenger".equals(requestType) && !passengerRequestService.existsById(requestId)) {
            return new ResponseEntity<>("\"Passenger request not found\"",HttpStatus.BAD_REQUEST);
        }
        RouteDetail createdRouteDetail = routeDetailService.createRouteDetail(routeDetail);
        return new ResponseEntity<>(createdRouteDetail, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRouteDetail(@PathVariable("id") UUID id) {
        routeDetailService.deleteRouteDetail(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/search")
    public ResponseEntity<List<RouteDetail>> searchRouteDetails(
            @RequestParam(value = "routeId", required = false) UUID routeId,
            @RequestParam(value = "requestType", required = false) String requestType,
            @RequestParam(value = "requestId", required = false) UUID requestId,
            @RequestParam(value = "isPickup", required = false) String isPickup,
            @RequestParam(value = "seqIndex", required = false) Integer seqIndex
    ) {
        List<RouteDetail> routeDetails = routeDetailService.searchRouteDetails(routeId, requestType, requestId, isPickup, seqIndex);
        if (!routeDetails.isEmpty()) {
            return new ResponseEntity<>(routeDetails, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
