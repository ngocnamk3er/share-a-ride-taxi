package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.RouteWarehouse;
import openerp.openerpresourceserver.repo.RouteWarehouseRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.*;

@SpringBootTest
public class RouteWareHouseServiceTest {

    @Mock
    private RouteWarehouseRepository repository;

    @InjectMocks
    private RouteWarehouseServiceImpl service;

    @Test
    public void testCreateRouteWarehouse() {
        // Tạo một đối tượng RouteWarehouse mới
        RouteWarehouse routeWarehouse = RouteWarehouse.builder()
                .id("123")
                .driverId("ngocnamk3er")
                .startExecuteStamp(LocalDateTime.now())
                .endStamp(LocalDateTime.now())
                .routeStatusId(1)
                .startWarehouseId("warehouse123")
                .build();

        // Giả lập repository.save() trả về đối tượng đã được lưu
        when(repository.save(any(RouteWarehouse.class))).thenReturn(routeWarehouse);

        // Gọi phương thức tạo mới route warehouse
        RouteWarehouse createdRouteWarehouse = service.createRoute(routeWarehouse);

        // Kiểm tra xem đối tượng đã được tạo mới thành công chưa
        assert (createdRouteWarehouse != null);
        assert (createdRouteWarehouse.getLastUpdatedStamp() != null);
        assert (createdRouteWarehouse.getCreatedStamp() != null);
    }
}
