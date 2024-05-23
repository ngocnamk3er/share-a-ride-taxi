package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.RouteWarehouseDetail;
import openerp.openerpresourceserver.repo.RouteWarehouseDetailRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class RouteWarehouseDetailServiceImpTest {

    @Mock
    private RouteWarehouseDetailRepository repository;

    @InjectMocks
    private RouteWarehouseDetailServiceImp service;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSaveRouteWarehouseDetail() {
        // Tạo một đối tượng RouteWarehouseDetail mới bằng cách sử dụng builder và setter
        RouteWarehouseDetail detail = RouteWarehouseDetail.builder()
                .id(UUID.randomUUID())
                .routeId("123")
                .warehouseId("warehouseId")
                .visited(false)
                .sequenceIndex(1)
                .build();

        // Giả lập repository.save() trả về đối tượng đã được lưu
        when(repository.save(any(RouteWarehouseDetail.class))).thenReturn(detail);

        // Gọi phương thức lưu RouteWarehouseDetail
        RouteWarehouseDetail savedDetail = service.save(detail);

        // Kiểm tra xem đối tượng đã được lưu thành công chưa
        assertEquals(detail, savedDetail);
        assertEquals(detail.getLastUpdatedStamp(), savedDetail.getLastUpdatedStamp());
        assert (savedDetail.getCreatedStamp() != null);
        assert (savedDetail.getLastUpdatedStamp() != null);

    }
}
