package wms.service.product;

import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.internal.util.StringHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wms.common.enums.ErrorCode;
import wms.dto.ReturnPaginationDTO;
import wms.dto.product.ProductDTO;
import wms.entity.ProductCategory;
import wms.entity.ProductEntity;
import wms.entity.ProductUnit;
import wms.exception.CustomException;
import wms.repo.ProductCategoryRepo;
import wms.repo.ProductRepo;
import wms.repo.ProductUnitRepo;
import wms.service.BaseService;
import wms.utils.GeneralUtils;


@Service
@Slf4j
public class ProductServiceImpl extends BaseService implements IProductService {
    @Autowired
    private ProductRepo productRepository;
    @Autowired
    private ProductUnitRepo productUnitRepo;
    @Autowired
    private ProductCategoryRepo productCategoryRepo;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ProductEntity createProduct(ProductDTO productDTO) throws CustomException {
        if (productRepository.getProductBySku(productDTO.getSku()) != null) {
            throw caughtException(ErrorCode.ALREADY_EXIST.getCode(), "Exist product with same sku, can't create");
        }
        ProductUnit unit = productUnitRepo.getProductUnitById(productDTO.getUnitId());
        ProductCategory category = productCategoryRepo.getProductCategoryById(productDTO.getCategoryId());

        if (unit== null) {
            throw caughtException(ErrorCode.NON_EXIST.getCode(), "Product with no specific unit, can't create");
        }
        if (category == null) {
            throw caughtException(ErrorCode.NON_EXIST.getCode(), "Product with no specific category, can't create");
        }
        ProductEntity newProduct = ProductEntity.builder()
                .code("PRO" + GeneralUtils.generateCodeFromSysTime())
                .name(productDTO.getName())
                .unitPerBox(productDTO.getUnitPerBox())
                .productUnit(unit)
                .brand(productDTO.getBrand())
                .productCategory(category)
                .status(productDTO.getStatus())
                .massType(productDTO.getMassType())
                .sku(productDTO.getSku().toUpperCase())
                .build();
        return productRepository.save(newProduct);
    }

    @Override
    public ReturnPaginationDTO<ProductEntity> getAllProducts(int page, int pageSize, String sortField, boolean isSortAsc) throws JsonProcessingException {
        Pageable pageable = StringHelper.isEmpty(sortField) ? getDefaultPage(page, pageSize)
                : isSortAsc ? PageRequest.of(page - 1, pageSize, Sort.by(sortField).ascending())
                : PageRequest.of(page - 1, pageSize, Sort.by(sortField).descending());
        Page<ProductEntity> productList = productRepository.search(pageable);
        return getPaginationResult(productList.getContent(), page, productList.getTotalPages(), productList.getTotalElements());
    }

    @Override
    public ProductEntity getProductById(long id) {
        return productRepository.getProductById(id);
    }

    @Override
    public ProductEntity getProductByCode(String code) {
        return productRepository.getProductByCode(code.toUpperCase());
    }

    @Override
    public ProductEntity getProductBySku(String sku) {
        return productRepository.getProductByCode(sku.toUpperCase());
    }

    @Override
    public ProductEntity updateProduct(ProductDTO productDTO, long id) throws CustomException {
        ProductEntity productBySku = productRepository.getProductByCode(productDTO.getSku());
        if (productBySku != null && productBySku.getId() != id) {
            throw caughtException(ErrorCode.ALREADY_EXIST.getCode(), "Exist product with same sku, can't update");
        }
        ProductUnit unit = productUnitRepo.getProductUnitById(productDTO.getUnitId());
        ProductCategory category = productCategoryRepo.getProductCategoryById(productDTO.getCategoryId());

        if (unit== null) {
            throw caughtException(ErrorCode.NON_EXIST.getCode(), "Product with no specific unit, can't update");
        }
        if (category == null) {
            throw caughtException(ErrorCode.NON_EXIST.getCode(), "Product with no specific category, can't update");
        }
        ProductEntity productToUpdate = productRepository.getProductById(id);
        productToUpdate.setName(productDTO.getName());
        productToUpdate.setUnitPerBox(productDTO.getUnitPerBox());
        productToUpdate.setProductCategory(category);
        productToUpdate.setProductUnit(unit);
        productToUpdate.setBrand(productDTO.getBrand());
        productToUpdate.setStatus(productDTO.getStatus());
        productToUpdate.setMassType(productDTO.getMassType());
        productToUpdate.setSku(productDTO.getSku());
        return productRepository.save(productToUpdate);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteProductById(long id) {
        productRepository.deleteById(id);
    }
}