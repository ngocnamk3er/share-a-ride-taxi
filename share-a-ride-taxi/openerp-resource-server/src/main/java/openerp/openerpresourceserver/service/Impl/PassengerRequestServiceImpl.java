package openerp.openerpresourceserver.service.Impl;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.PassengerRequest;
import openerp.openerpresourceserver.repo.PassengerRequestRepository;
import openerp.openerpresourceserver.service.Interface.PassengerRequestService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PassengerRequestServiceImpl implements PassengerRequestService {
    private final PassengerRequestRepository passengerRequestRepository;
    private final LocationServiceImpl locationService;

    @Override
    public List<PassengerRequest> getAllPassengerRequests() {
        return passengerRequestRepository.findAll();
    }

    @Override
    public PassengerRequest getPassengerRequestById(UUID id) {
        return passengerRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passenger request not found with id: " + id));
    }

    @Override
    public PassengerRequest savePassengerRequest(PassengerRequest passengerRequest) {
        return passengerRequestRepository.save(passengerRequest);
    }

    @Override
    public void deletePassengerRequest(UUID id) {
        passengerRequestRepository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID requestId) {
        return passengerRequestRepository.existsById(requestId);
    }

    @Override
    public List<PassengerRequest> getPassengerRequestByRouteId(String routeId) {
        return passengerRequestRepository.findAllByRouteId(routeId);
    }
}
