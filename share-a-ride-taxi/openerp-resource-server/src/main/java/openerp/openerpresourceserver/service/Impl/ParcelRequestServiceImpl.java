package openerp.openerpresourceserver.service.Impl;


import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.repo.ParcelRequestRepository;
import openerp.openerpresourceserver.service.Interface.ParcelRequestService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ParcelRequestServiceImpl implements ParcelRequestService {

    private final ParcelRequestRepository repository;

    @Override
    public ParcelRequest createParcelRequest(ParcelRequest parcelRequest) {
        return repository.save(parcelRequest);
    }

    @Override
    public ParcelRequest getParcelRequestById(UUID id) {
        return repository.findById(id).orElse(null);
    }

    @Override
    public List<ParcelRequest> getParcelRequestByPickUpRouteId(String id) {
       return  repository.getParcelRequesByPickUpRoute(id);
    }

    @Override
    public List<ParcelRequest> getAllParcelRequests() {
        return repository.findAll();
    }

    @Override
    public void deleteParcelRequest(UUID id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(UUID requestId) {
        return repository.existsById(requestId);
    }
}
