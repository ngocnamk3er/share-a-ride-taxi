package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.PassengerRequest;

import java.util.List;
import java.util.UUID;

public interface PassengerRequestService {
    List<PassengerRequest> getAllPassengerRequests();

    PassengerRequest getPassengerRequestById(UUID id);

    PassengerRequest savePassengerRequest(PassengerRequest passengerRequest);


    void deletePassengerRequest(UUID id);

    boolean existsById(UUID requestId);
}
