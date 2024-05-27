package openerp.openerpresourceserver.service.Impl;


import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.DTO.response.ParcelRequestWithSeqIndex;
import openerp.openerpresourceserver.entity.ParcelRequest;
import openerp.openerpresourceserver.repo.ParcelRequestRepository;
import openerp.openerpresourceserver.service.Interface.ParcelRequestService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
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
    public List<ParcelRequestWithSeqIndex> getParcelRequestByPickUpRouteId(String pickUpRouteId) {
        List<Object[]> results = repository.getParcelRequesByPickUpRoute(pickUpRouteId);
        List<ParcelRequestWithSeqIndex> parcelRequestsDTO = new ArrayList<>();

        for (Object[] result : results) {
            ParcelRequestWithSeqIndex dto = new ParcelRequestWithSeqIndex();
            dto.setRequestId((UUID) result[0]);
            dto.setSenderName((String) result[1]);
            dto.setSenderPhoneNumber((String) result[2]);
            dto.setSenderEmail((String) result[3]);
            dto.setRecipientName((String) result[4]);
            dto.setRecipientPhoneNumber((String) result[5]);
            dto.setRecipientEmail((String) result[6]);

            // Convert Instant to LocalDateTime
            if (result[7] instanceof Instant) {
                dto.setRequestTime(LocalDateTime.ofInstant((Instant) result[7], ZoneOffset.UTC));
            }

            dto.setStatusId((Integer) result[8]);
            dto.setDistance((BigDecimal) (result[9]));

            // Convert Instant to LocalDateTime
            if (result[10] instanceof Instant) {
                dto.setEndTime(LocalDateTime.ofInstant((Instant) result[10], ZoneOffset.UTC));
            }

            dto.setPickupLatitude((BigDecimal)(result[11]));
            dto.setPickupLongitude((BigDecimal)(result[12]));
            dto.setPickupAddress((String) result[13]);
            dto.setDropoffLatitude((BigDecimal)(result[14]));
            dto.setDropoffLongitude((BigDecimal)(result[15]));
            dto.setDropoffAddress((String) result[16]);
            dto.setCreatedByUserLoginId((String) result[17]);
            dto.setPickupAddressNote((String) result[18]);
            dto.setDropoffAddressNote((String) result[19]);
            dto.setAssignedWarehouseId((String) result[20]);
            dto.setLat((BigDecimal)(result[21]));
            dto.setLon((BigDecimal)(result[22]));
            dto.setAddress((String) result[23]);
            dto.setSeqIndex((int) result[24]);
            dto.setVisited((boolean) result[25]);

            parcelRequestsDTO.add(dto);
        }

        return parcelRequestsDTO;
    }

    @Override
    public List<ParcelRequestWithSeqIndex> getParcelRequestByDropOffRouteId(String dropOffRouteId) {
        List<Object[]> results = repository.getParcelRequesByDropOffRoute(dropOffRouteId);
        List<ParcelRequestWithSeqIndex> parcelRequestsDTO = new ArrayList<>();

        for (Object[] result : results) {
            ParcelRequestWithSeqIndex dto = new ParcelRequestWithSeqIndex();
            dto.setRequestId((UUID) result[0]);
            dto.setSenderName((String) result[1]);
            dto.setSenderPhoneNumber((String) result[2]);
            dto.setSenderEmail((String) result[3]);
            dto.setRecipientName((String) result[4]);
            dto.setRecipientPhoneNumber((String) result[5]);
            dto.setRecipientEmail((String) result[6]);

            // Convert Instant to LocalDateTime
            if (result[7] instanceof Instant) {
                dto.setRequestTime(LocalDateTime.ofInstant((Instant) result[7], ZoneOffset.UTC));
            }

            dto.setStatusId((Integer) result[8]);
            dto.setDistance((BigDecimal) (result[9]));

            // Convert Instant to LocalDateTime
            if (result[10] instanceof Instant) {
                dto.setEndTime(LocalDateTime.ofInstant((Instant) result[10], ZoneOffset.UTC));
            }

            dto.setPickupLatitude((BigDecimal)(result[11]));
            dto.setPickupLongitude((BigDecimal)(result[12]));
            dto.setPickupAddress((String) result[13]);
            dto.setDropoffLatitude((BigDecimal)(result[14]));
            dto.setDropoffLongitude((BigDecimal)(result[15]));
            dto.setDropoffAddress((String) result[16]);
            dto.setCreatedByUserLoginId((String) result[17]);
            dto.setPickupAddressNote((String) result[18]);
            dto.setDropoffAddressNote((String) result[19]);
            dto.setAssignedWarehouseId((String) result[20]);
            dto.setLat((BigDecimal)(result[21]));
            dto.setLon((BigDecimal)(result[22]));
            dto.setAddress((String) result[23]);
            dto.setSeqIndex((int) result[24]);
            dto.setVisited((boolean) result[25]);

            parcelRequestsDTO.add(dto);
        }

        return parcelRequestsDTO;
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
