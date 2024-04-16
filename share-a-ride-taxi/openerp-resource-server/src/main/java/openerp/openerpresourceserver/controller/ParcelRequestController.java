package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.Location;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.entity.PassengerRequest;
import openerp.openerpresourceserver.enums.RequestStatus;
import openerp.openerpresourceserver.model.request.ParcelRequestRequest;
import openerp.openerpresourceserver.model.response.ParcelRequestResponse;
import openerp.openerpresourceserver.service.LocationService;
import openerp.openerpresourceserver.service.ParcelRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/parcel-requests")
@RequiredArgsConstructor
public class ParcelRequestController {

    private final ParcelRequestService parcelRequestService;
    private final LocationService locationService;

    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @GetMapping
    public List<ParcelRequestResponse> getAllParcelRequests() {
        List<ParcelRequest> parcelRequests = parcelRequestService.getAllParcelRequests();
        List<ParcelRequestResponse> responseList = new ArrayList<>();

        for (ParcelRequest request : parcelRequests) {
            ParcelRequestResponse response = convertToResponse(request);
            responseList.add(response);
        }

        return responseList;
    }

    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @GetMapping("/{id}")
    public ParcelRequestResponse getParcelRequestById(@PathVariable UUID id) {
        return convertToResponse(parcelRequestService.getParcelRequestById(id));
    }

    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @PostMapping
    public ParcelRequestResponse createParcelRequest(@RequestBody ParcelRequestRequest request) {
        return convertToResponse(parcelRequestService.createParcelRequest(convertToEntityBeforeCreate(request)));
    }

    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @PutMapping("/{id}")
    public ParcelRequestResponse updateParcelRequest(@PathVariable UUID id,@RequestBody ParcelRequestRequest request) {
        ParcelRequest existPassengerRequest = parcelRequestService.getParcelRequestById(id);
        return convertToResponse(parcelRequestService.createParcelRequest(convertToEntityBeforeCreate(request)));
    }

    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @DeleteMapping("/{id}")
    public void deleteParcelRequest(@PathVariable UUID id) {
        parcelRequestService.deleteParcelRequest(id);
    }

    public ParcelRequest convertToEntityBeforeCreate(ParcelRequestRequest request) {
        ParcelRequest parcelRequest = new ParcelRequest();
        parcelRequest.setSenderName(request.getSenderName());
        parcelRequest.setSenderPhoneNumber(request.getSenderPhoneNumber());
        parcelRequest.setSenderEmail(request.getSenderEmail());
        parcelRequest.setRecipientName(request.getRecipientName());
        parcelRequest.setRecipientPhoneNumber(request.getRecipientPhoneNumber());
        parcelRequest.setRecipientEmail(request.getRecipientEmail());
        parcelRequest.setRequestTime(request.getRequestTime());
        parcelRequest.setStatusId(request.getStatusId());

        Location pickupLocation = new Location();
        pickupLocation.setLatitude(request.getPickupLocationLatitude());
        pickupLocation.setLongitude(request.getPickupLocationLongitude());
        pickupLocation.setAddress(request.getPickupLocationAddress());
        Location savedPickupLocation = locationService.saveLocation(pickupLocation);
        parcelRequest.setPickupLocationId(savedPickupLocation.getLocationId());

        Location dropoffLocation = new Location();
        dropoffLocation.setLatitude(request.getDropoffLocationLatitude());
        dropoffLocation.setLongitude(request.getDropoffLocationLongitude());
        dropoffLocation.setAddress(request.getDropoffLocationAddress());
        Location savedDropoffLocation = locationService.saveLocation(dropoffLocation);
        parcelRequest.setDropoffLocationId(savedDropoffLocation.getLocationId());

        return parcelRequest;
    }

    private ParcelRequestResponse convertToResponse(ParcelRequest request) {
        ParcelRequestResponse response = new ParcelRequestResponse();
        response.setSenderName(request.getSenderName());
        response.setSenderPhoneNumber(request.getSenderPhoneNumber());
        response.setSenderEmail(request.getSenderEmail());
        response.setRecipientName(request.getRecipientName());
        response.setRecipientPhoneNumber(request.getRecipientPhoneNumber());
        response.setRecipientEmail(request.getRecipientEmail());
        response.setId(request.getRequestId());

        Location pickupLocation = locationService.getLocationById(request.getPickupLocationId());
        response.setPickupLocationLatitude(pickupLocation.getLatitude());
        response.setPickupLocationLongitude(pickupLocation.getLongitude());
        response.setPickupLocationAddress(pickupLocation.getAddress());

        Location dropoffLocation = locationService.getLocationById(request.getDropoffLocationId());
        response.setDropoffLocationLatitude(dropoffLocation.getLatitude());
        response.setDropoffLocationLongitude(dropoffLocation.getLongitude());
        response.setDropoffLocationAddress(dropoffLocation.getAddress());

        response.setRequestTime(request.getRequestTime());
        RequestStatus status = RequestStatus.values()[request.getStatusId()];
        response.setRequestStatus(status.toString());

        return response;
    }
}
