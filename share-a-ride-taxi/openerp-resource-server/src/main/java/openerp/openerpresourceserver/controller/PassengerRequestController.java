package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.Location;
import openerp.openerpresourceserver.entity.PassengerRequest;
import openerp.openerpresourceserver.model.request.PassengerRequestRequest;
import openerp.openerpresourceserver.model.response.PassengerRequestResponse;
import openerp.openerpresourceserver.service.LocationService;
import openerp.openerpresourceserver.service.PassengerRequestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/passenger-requests")
@RequiredArgsConstructor
public class PassengerRequestController {

    private final PassengerRequestService passengerRequestService;
    private final LocationService locationService;
//    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @GetMapping
    public List<PassengerRequestResponse> getAllPassengerRequests() {
        List<PassengerRequest> passengerRequests = passengerRequestService.getAllPassengerRequests();
        List<PassengerRequestResponse> responseList = new ArrayList<>();

        for (PassengerRequest request : passengerRequests) {
            PassengerRequestResponse response = convertToResponse(request);
            responseList.add(response);
        }

        return responseList;
    }

//    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @GetMapping("/{id}")
    public PassengerRequestResponse getPassengerRequestById(@PathVariable UUID id) {
        return convertToResponse(passengerRequestService.getPassengerRequestById(id));
    }

    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @PostMapping
    public PassengerRequestResponse createPassengerRequest(@RequestBody PassengerRequestRequest request) {
        System.out.println("-----------------------");
        System.out.println(request);
        System.out.println("-----------------------");
        return convertToResponse(passengerRequestService.savePassengerRequest(convertToEntityBeforeCreate(request)));
    }

    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @PutMapping("/{id}")
    public PassengerRequestResponse updatePassengerRequest(@PathVariable UUID id, @RequestBody PassengerRequestRequest request) {
        PassengerRequest existPassengerRequest = passengerRequestService.getPassengerRequestById(id);
        return convertToResponse(passengerRequestService.savePassengerRequest(convertToEntityBeforeUpdate(existPassengerRequest, request)));
    }



    @PreAuthorize("hasRole('WMS_ONLINE_CUSTOMER')")
    @DeleteMapping("/{id}")
    public void deletePassengerRequest(@PathVariable UUID id) {
        passengerRequestService.deletePassengerRequest(id);
    }

    public PassengerRequest convertToEntityBeforeCreate(PassengerRequestRequest request) {
        PassengerRequest passengerRequest = new PassengerRequest();
        passengerRequest.setPassengerName(request.getPassengerName());
        passengerRequest.setPhoneNumber(request.getPhoneNumber());
        passengerRequest.setEmail(request.getEmail());
        passengerRequest.setRequestTime(request.getRequestTime());
        passengerRequest.setStatusId(request.getStatusId());

        // Lưu thông tin vị trí lấy và trả khách vào cơ sở dữ liệu trước
        Location pickupLocation = new Location();
        pickupLocation.setLatitude(request.getPickupLocationLatitude());
        pickupLocation.setLongitude(request.getPickupLocationLongitude());
        pickupLocation.setAddress(request.getPickupLocationAddress());
        Location savedPickupLocation = locationService.saveLocation(pickupLocation);
        passengerRequest.setPickupLocationId(savedPickupLocation.getLocationId());

        Location dropoffLocation = new Location();
        dropoffLocation.setLatitude(request.getDropoffLocationLatitude());
        dropoffLocation.setLongitude(request.getDropoffLocationLongitude());
        dropoffLocation.setAddress(request.getDropoffLocationAddress());
        Location savedDropoffLocation = locationService.saveLocation(dropoffLocation);
        passengerRequest.setDropoffLocationId(savedDropoffLocation.getLocationId());

        return passengerRequest;
    }

    public PassengerRequest convertToEntityBeforeUpdate(PassengerRequest existPassengerRequest, PassengerRequestRequest request) {
        existPassengerRequest.setPassengerName(request.getPassengerName());
        existPassengerRequest.setPhoneNumber(request.getPhoneNumber());
        existPassengerRequest.setEmail(request.getEmail());
        existPassengerRequest.setRequestTime(request.getRequestTime());
        existPassengerRequest.setStatusId(request.getStatusId());

        Location pickupLocation = locationService.getLocationById(existPassengerRequest.getPickupLocationId());
        pickupLocation.setLatitude(request.getPickupLocationLatitude());
        pickupLocation.setLongitude(request.getPickupLocationLongitude());
        pickupLocation.setAddress(request.getPickupLocationAddress());
        Location savedPickupLocation = locationService.saveLocation(pickupLocation);
        existPassengerRequest.setPickupLocationId(savedPickupLocation.getLocationId());

        Location dropoffLocation = locationService.getLocationById(existPassengerRequest.getDropoffLocationId());
        dropoffLocation.setLatitude(request.getDropoffLocationLatitude());
        dropoffLocation.setLongitude(request.getDropoffLocationLongitude());
        dropoffLocation.setAddress(request.getDropoffLocationAddress());
        Location savedDropoffLocation = locationService.saveLocation(dropoffLocation);
        existPassengerRequest.setDropoffLocationId(savedDropoffLocation.getLocationId());

        return existPassengerRequest;
    }

    private PassengerRequestResponse convertToResponse(PassengerRequest request) {
        PassengerRequestResponse response = new PassengerRequestResponse();
        response.setPassengerName(request.getPassengerName());
        response.setPhoneNumber(request.getPhoneNumber());
        response.setEmail(request.getEmail());
        response.setId(request.getRequestId());
        // Truy xuất thông tin vị trí lấy
        Location pickupLocation = locationService.getLocationById(request.getPickupLocationId());
        response.setPickupLocationLatitude(pickupLocation.getLatitude());
        response.setPickupLocationLongitude(pickupLocation.getLongitude());
        response.setPickupLocationAddress(pickupLocation.getAddress());

        // Truy xuất thông tin vị trí trả
        Location dropoffLocation = locationService.getLocationById(request.getDropoffLocationId());
        response.setDropoffLocationLatitude(dropoffLocation.getLatitude());
        response.setDropoffLocationLongitude(dropoffLocation.getLongitude());
        response.setDropoffLocationAddress(dropoffLocation.getAddress());

        response.setRequestTime(request.getRequestTime());
        response.setStatusId(request.getStatusId());

        return response;
    }
}
