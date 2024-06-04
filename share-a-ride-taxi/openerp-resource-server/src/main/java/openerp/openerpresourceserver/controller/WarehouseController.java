package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.DTO.response.WareHouseWithIndex;
import openerp.openerpresourceserver.entity.Warehouse;
import openerp.openerpresourceserver.service.Interface.WarehouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/warehouses")
@RequiredArgsConstructor
public class WarehouseController {

    @Autowired
    private final WarehouseService warehouseService;

    @GetMapping
    public List<Warehouse> getAllWarehouses() {
        return warehouseService.getAllWarehouses();
    }

    @GetMapping("/{id}")
    public Warehouse getWarehouseById(@PathVariable String id) {
        return warehouseService.getWarehouseById(id);
    }

    @GetMapping("/by-warehouse-route/{id}")
    public List<WareHouseWithIndex> getWarehouseByWarehouseRouteId(@PathVariable String id) {
        return warehouseService.getWarehouseByWarehoueRouteId(id);
    }

    @PostMapping
    public Warehouse createWarehouse(@RequestBody Warehouse warehouse) {
        warehouse.setCreatedAt(LocalDateTime.now());
        warehouse.setUpdatedAt(LocalDateTime.now());
        return warehouseService.saveWarehouse(warehouse);
    }

    @PutMapping("/{id}")
    public Warehouse updateWarehouse(@PathVariable String id, @RequestBody Warehouse warehouse) {
        warehouse.setWarehouseId(id);
        warehouse.setUpdatedAt(LocalDateTime.now());
        return warehouseService.saveWarehouse(warehouse);
    }

    @DeleteMapping("/{id}")
    public void deleteWarehouse(@PathVariable String id) {
        warehouseService.deleteWarehouse(id);
    }


}
