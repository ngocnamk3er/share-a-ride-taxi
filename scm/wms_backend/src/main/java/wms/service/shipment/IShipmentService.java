package wms.service.shipment;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import wms.dto.ReturnPaginationDTO;
import wms.dto.product.ProductDTO;
import wms.dto.shipment.ShipmentDTO;
import wms.entity.ProductEntity;
import wms.entity.Shipment;
import wms.exception.CustomException;

public interface IShipmentService {
    Shipment createShipment(ShipmentDTO shipmentDTO, JwtAuthenticationToken token) throws CustomException;
    ReturnPaginationDTO<Shipment> getAllShipments(int page, int pageSize, String sortField, boolean isSortAsc) throws JsonProcessingException;
    Shipment getShipmentById(long id);
    Shipment getShipmentByCode(String code);
    Shipment updateShipment(ProductDTO productDTO, long id) throws CustomException;
    void deleteShipmentById(long id);
}
