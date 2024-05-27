package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.DTO.response.ParcelRequestWithSeqIndex;
import openerp.openerpresourceserver.entity.ParcelRequest;

import java.util.List;
import java.util.UUID;

public interface ParcelRequestService {
    ParcelRequest createParcelRequest(ParcelRequest parcelRequest);

    ParcelRequest getParcelRequestById(UUID id);

    List<ParcelRequestWithSeqIndex> getParcelRequestByPickUpRouteId(String id);

    List<ParcelRequest> getAllParcelRequests();

    void deleteParcelRequest(UUID id);

    boolean existsById(UUID requestId);

    List<ParcelRequestWithSeqIndex> getParcelRequestByDropOffRouteId(String id);
}
