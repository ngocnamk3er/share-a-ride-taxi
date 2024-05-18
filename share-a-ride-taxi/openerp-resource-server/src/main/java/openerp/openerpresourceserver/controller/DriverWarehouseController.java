package openerp.openerpresourceserver.controller;

import lombok.AllArgsConstructor;
import openerp.openerpresourceserver.entity.DriverWarehouse;
import openerp.openerpresourceserver.service.Interface.DriverWarehouseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@AllArgsConstructor
@RequestMapping("/driver-warehouses")
public class DriverWarehouseController {

    private final DriverWarehouseService service;

    @GetMapping
    public List<DriverWarehouse> getAllDriverWarehouses() {
        return service.getAllDriverWarehouses();
    }

    @GetMapping("/{driverId}/{warehouseId}")
    public ResponseEntity<DriverWarehouse> getDriverWarehouseById(
            @PathVariable(value = "driverId") String driverId,
            @PathVariable(value = "warehouseId") String warehouseId) {
        DriverWarehouse warehouse = service.getDriverWarehouseById(driverId, warehouseId);
        if (warehouse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(warehouse);
    }

    @GetMapping("/{driverId}")
    public ResponseEntity<List<DriverWarehouse>> getDriverWarehouseByDriverId(
            @PathVariable(value = "driverId") String driverId) {
        List<DriverWarehouse> warehouse = service.getDriverWarehouseByDriverId(driverId);
        if (warehouse == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(warehouse);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<DriverWarehouse>> getDriverWarehouseByWarehouseId(
            @PathVariable(value = "warehouseId") String warehouseId) {
        List<DriverWarehouse> warehouses = service.getDriverWarehouseByWarehouseId(warehouseId);
        if (warehouses == null || warehouses.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(warehouses);
    }

    @PostMapping
    public ResponseEntity<DriverWarehouse> createDriverWarehouse(@RequestBody DriverWarehouse driverWarehouse) {
        System.out.println("driverWarehouse");
        System.out.println(driverWarehouse);
        driverWarehouse.setJoiningDate(LocalDateTime.now());
        DriverWarehouse createdWarehouse = service.createDriverWarehouse(driverWarehouse);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdWarehouse);
    }

    @DeleteMapping("/{driverId}/{warehouseId}")
    public ResponseEntity<Void> deleteDriverWarehouse(
            @PathVariable(value = "driverId") String driverId,
            @PathVariable(value = "warehouseId") String warehouseId) {
        service.deleteDriverWarehouse(driverId, warehouseId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{driverId}/{warehouseId}/activate")
    public ResponseEntity<DriverWarehouse> activateDriverWarehouse(
            @PathVariable String driverId,
            @PathVariable String warehouseId) {
        DriverWarehouse activatedDriver = service.activateDriverWarehouse(driverId, warehouseId);
        return ResponseEntity.ok().body(activatedDriver);
    }

}
