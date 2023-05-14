package wms.service.product;

import com.fasterxml.jackson.core.JsonProcessingException;
import wms.dto.ReturnPaginationDTO;
import wms.dto.product.ProductDTO;
import wms.entity.ProductEntity;
import wms.exception.CustomException;


public interface IProductService {
//    List<ProductEntity> createProductFromExcel(MultipartFile file) throws IOException, CustomException;
    ProductEntity createProduct(ProductDTO productDTO) throws CustomException;
    ReturnPaginationDTO<ProductEntity> getAllProducts(int page, int pageSize, String sortField, boolean isSortAsc) throws JsonProcessingException;
    ProductEntity getProductById(long id);
    ProductEntity getProductByCode(String code);
    ProductEntity getProductBySku(String sku);
    ProductEntity updateProduct(ProductDTO productDTO, long id) throws CustomException;
    void deleteProductById(long id);
}
