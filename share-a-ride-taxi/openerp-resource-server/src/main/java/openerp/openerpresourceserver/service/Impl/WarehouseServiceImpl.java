package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.DTO.response.ParcelRequestWithSeqIndex;
import openerp.openerpresourceserver.DTO.response.WareHouseWithIndex;
import openerp.openerpresourceserver.entity.Warehouse;
import openerp.openerpresourceserver.repo.WarehouseRepository;
import openerp.openerpresourceserver.service.Interface.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class WarehouseServiceImpl implements WarehouseService {

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Override
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    @Override
    public Warehouse getWarehouseById(String id) {
        return warehouseRepository.findById(id).orElse(null);
    }

    @Override
    public Warehouse saveWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    @Override
    public void deleteWarehouse(String id) {
        warehouseRepository.deleteById(id);
    }

    @Override
    public List<WareHouseWithIndex> getWarehouseByWarehoueRouteId(String id) {
        List<Object[]> results = warehouseRepository.getWarehouseByWarehoueRouteId(id);
        List<WareHouseWithIndex> wareHousesDTO = new ArrayList<>();

        for (Object[] result : results) {
            WareHouseWithIndex dto = new WareHouseWithIndex();
            dto.setWarehouseId((String) result[0]);
            dto.setWarehouseName((String) result[1]);
            dto.setAddress((String) result[2]);
            dto.setAddressNote((String) result[3]);
            dto.setLat((BigDecimal) result[4]);
            dto.setLon((BigDecimal) result[5]);
            dto.setCreatedAt((LocalDateTime) result[6]);
            dto.setUpdatedAt((LocalDateTime) result[7]);
            dto.setCreatedByUserId((String) result[8]);
            dto.setVisited((Boolean) result[9]);
            dto.setSeqIndex((Integer) result[10]);
            dto.setId((UUID) result[11]);
            wareHousesDTO.add(dto);
        }

        return wareHousesDTO;
    }
}
