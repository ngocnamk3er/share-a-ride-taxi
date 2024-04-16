package openerp.openerpresourceserver.service.Impl;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.entity.PassengerRequest;
import openerp.openerpresourceserver.enums.RequestStatus;
import openerp.openerpresourceserver.enums.RequestType;
import openerp.openerpresourceserver.repo.RouteDetailRepository;
import openerp.openerpresourceserver.service.ParcelRequestService;
import openerp.openerpresourceserver.service.PassengerRequestService;
import openerp.openerpresourceserver.service.RouteDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import openerp.openerpresourceserver.entity.RouteDetail;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class RouteDetailServiceImpl implements RouteDetailService {

    private final RouteDetailRepository routeDetailRepository;
    private final ParcelRequestService parcelRequestService;
    private final PassengerRequestService passengerRequestService;


    @Override
    public List<RouteDetail> getAllRouteDetails() {
        return routeDetailRepository.findAll();
    }

    @Override
    public RouteDetail getRouteDetailById(UUID id) {
        return routeDetailRepository.findById(id).orElse(null);
    }

    @Override
    public RouteDetail createRouteDetail(RouteDetail routeDetail) {
        String requestType = routeDetail.getRequestType();
        if (requestType.equals("parcel")){
            ParcelRequest parcelRequest = parcelRequestService.getParcelRequestById(routeDetail.getRequestId());
            parcelRequest.setStatusId(RequestStatus.DRIVER_ASSIGNED.ordinal());
            parcelRequestService.createParcelRequest(parcelRequest);
        }else{
            PassengerRequest passengerRequest = passengerRequestService.getPassengerRequestById(routeDetail.getRequestId());
            passengerRequest.setStatusId(RequestStatus.DRIVER_ASSIGNED.ordinal());
            passengerRequestService.savePassengerRequest(passengerRequest);
        }
        routeDetail.setIsPickup(false);
        return routeDetailRepository.save(routeDetail);
    }

    @Override
    public RouteDetail updateRouteDetail(UUID id, RouteDetail routeDetail) {
        if (routeDetailRepository.existsById(id)) {
            routeDetail.setId(id);
            return routeDetailRepository.save(routeDetail);
        }
        return null;
    }

    @Override
    public void deleteRouteDetail(UUID id) {
        routeDetailRepository.deleteById(id);
    }

    @Override
    public void deleteRouteDetailsByRouteId(UUID routeId) {
        List<RouteDetail> routeDetails = routeDetailRepository.findByRouteId(routeId);
        for (int i = 0; i<routeDetails.size();i++){
            if(routeDetails.get(i).getRequestType().equals(RequestType.parcel.toString())){
                ParcelRequest parcelRequest = parcelRequestService.getParcelRequestById(routeDetails.get(i).getRequestId());
                parcelRequest.setStatusId(RequestStatus.RECEIVED.ordinal());
                parcelRequestService.createParcelRequest(parcelRequest);
            }else{
                PassengerRequest passengerRequest = passengerRequestService.getPassengerRequestById(routeDetails.get(i).getRequestId());
                passengerRequest.setStatusId(RequestStatus.RECEIVED.ordinal());
                passengerRequestService.savePassengerRequest(passengerRequest);
            }
        }
        routeDetailRepository.deleteByRouteId(routeId);
    }

    @Override
    public List<RouteDetail> searchRouteDetails(UUID routeId, String requestType, UUID requestId, String isPickup, Integer seqIndex) {
        System.out.println("---------------------");
        System.out.println(routeId);
        System.out.println("---------------------");
        return routeDetailRepository.findByRouteId(routeId);
    }
}
