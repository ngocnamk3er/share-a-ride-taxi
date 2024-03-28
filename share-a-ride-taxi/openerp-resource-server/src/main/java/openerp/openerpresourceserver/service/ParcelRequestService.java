package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.ParcelRequest;

import java.util.List;
import java.util.UUID;

public interface ParcelRequestService {
    ParcelRequest createParcelRequest(ParcelRequest parcelRequest);

    ParcelRequest getParcelRequestById(UUID id);

    List<ParcelRequest> getAllParcelRequests();

    void deleteParcelRequest(UUID id);

    boolean existsById(UUID requestId);
}
