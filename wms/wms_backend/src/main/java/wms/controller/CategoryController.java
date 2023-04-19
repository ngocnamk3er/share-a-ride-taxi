package wms.controller;

import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import wms.common.constant.DefaultConst;
import wms.dto.category.*;
import wms.entity.ResultEntity;
import wms.service.category.ICategoryService;

import javax.validation.Valid;

@Controller
@RequestMapping("/category")
public class CategoryController extends BaseController {
    @Autowired
    private ICategoryService categoryService;

    /**
     * Product Unit
     */
    @PostMapping(path = "/product-unit/create-unit")
    public ResponseEntity<?> createUnit(@Valid @RequestBody ProductUnitDTO productUnitDTO) {
        try {
            return response(new ResultEntity(1, "Create product unit successfully", categoryService.createProductUnit(productUnitDTO)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @ApiOperation(value = "Get all product units with pagination and sorting and some conditions")
    @GetMapping(path = "/product-unit/get-all-unit")
    public ResponseEntity<?> getAllUnits(
            @RequestParam(value = DefaultConst.PAGE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE) Integer page,
            @RequestParam(value = DefaultConst.PAGE_SIZE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE_SIZE) Integer pageSize,
            @RequestParam(value = DefaultConst.SORT_TYPE, required = false, defaultValue = DefaultConst.STRING) String sortField,
            @RequestParam(value = "sort_asc", required = false, defaultValue = DefaultConst.BOOL) Boolean isSortAsc
    ) {
        try {
            return response(new ResultEntity(1, "Get list product units successfully", categoryService.getAllProductUnit(page, pageSize, sortField, isSortAsc)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/product-unit/get-unit-by-id/{id}")
    public ResponseEntity<?> getUnitById(@PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Get unit by id successfully", categoryService.getProductUnitById(id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/product-unit/get-unit-by-code")
    public ResponseEntity<?> getUnitByCode(
            @RequestParam(value = "code", required = true, defaultValue = DefaultConst.STRING) String code) {
        try {
            return response(new ResultEntity(1, "Get unit by code successfully", categoryService.getProductUnitByCode(code)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @PutMapping(path = "/product-unit/update-unit/{id}")
    public ResponseEntity<?> updateProductUnit(@Valid @RequestBody ProductUnitDTO productUnitDTO, @PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Update product unit successfully", categoryService.updateProductUnit(productUnitDTO, id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @DeleteMapping(path = "/product-unit/remove-unit/{id}")
    public ResponseEntity<?> deleteProductUnitByCode(@PathVariable("id") long id) {
        try {
            categoryService.deleteProductUnitById(id);
            return response(new ResultEntity(1, "Delete product unit successfully", id));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    /**
     * Product Category
     */
    @PostMapping(path = "/product-category/create-category")
    public ResponseEntity<?> createUnit(@Valid @RequestBody ProductCategoryDTO productCategoryDTO) {
        try {
            return response(new ResultEntity(1, "Create product category successfully", categoryService.createProductCategory(productCategoryDTO)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @ApiOperation(value = "Get all product categorys with pagination and sorting and some conditions")
    @GetMapping(path = "/product-category/get-all-category")
    public ResponseEntity<?> getAllCategories(
            @RequestParam(value = DefaultConst.PAGE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE) Integer page,
            @RequestParam(value = DefaultConst.PAGE_SIZE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE_SIZE) Integer pageSize,
            @RequestParam(value = DefaultConst.SORT_TYPE, required = false, defaultValue = DefaultConst.STRING) String sortField,
            @RequestParam(value = "sort_asc", required = false, defaultValue = DefaultConst.BOOL) Boolean isSortAsc
    ) {
        try {
            return response(new ResultEntity(1, "Get list product categories successfully", categoryService.getAllProductCategory(page, pageSize, sortField, isSortAsc)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/product-category/get-category-by-id/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Get category by id successfully", categoryService.getProductCategoryById(id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/product-category/get-category-by-code")
    public ResponseEntity<?> getCategoryByCode(
            @RequestParam(value = "code", required = true, defaultValue = DefaultConst.STRING) String code) {
        try {
            return response(new ResultEntity(1, "Get category by code successfully", categoryService.getProductCategoryByCode(code)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @PutMapping(path = "/product-category/update-category/{id}")
    public ResponseEntity<?> updateProductCategory(@Valid @RequestBody ProductCategoryDTO productCategoryDTO, @PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Update product category successfully", categoryService.updateProductCategory(productCategoryDTO, id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @DeleteMapping(path = "/product-category/remove-category/{id}")
    public ResponseEntity<?> deleteProductCategoryById(@PathVariable("id") long id) {
        try {
            categoryService.deleteProductCategoryById(id);
            return response(new ResultEntity(1, "Delete product category successfully", id));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }

    /**
     * Customer category
     */
    @PostMapping(path = "/customer-type/create")
    public ResponseEntity<?> createUnit(@Valid @RequestBody CustomerTypeDTO customerTypeDTO) {
        try {
            return response(new ResultEntity(1, "Create customer type successfully", categoryService.createCustomerType(customerTypeDTO)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @ApiOperation(value = "Get all customer types with pagination and sorting and some conditions")
    @GetMapping(path = "/customer-type/get-all")
    public ResponseEntity<?> getAllCustomerType(
            @RequestParam(value = DefaultConst.PAGE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE) Integer page,
            @RequestParam(value = DefaultConst.PAGE_SIZE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE_SIZE) Integer pageSize,
            @RequestParam(value = DefaultConst.SORT_TYPE, required = false, defaultValue = DefaultConst.STRING) String sortField,
            @RequestParam(value = "sort_asc", required = false, defaultValue = DefaultConst.BOOL) Boolean isSortAsc
    ) {
        try {
            return response(new ResultEntity(1, "Get list customer types successfully", categoryService.getAllCustomerType(page, pageSize, sortField, isSortAsc)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/customer-type/get-type-by-id/{id}")
    public ResponseEntity<?> getCustomerTypeById(@PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Get type by id successfully", categoryService.getCustomerTypeById(id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/customer-type/get-type-by-code")
    public ResponseEntity<?> getCustomerTypeByCode(
            @RequestParam(value = "code", required = true, defaultValue = DefaultConst.STRING) String code) {
        try {
            return response(new ResultEntity(1, "Get type by code successfully", categoryService.getCustomerTypeByCode(code)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @PutMapping(path = "/customer-type/update-type/{id}")
    public ResponseEntity<?> updateCustomerType(@Valid @RequestBody CustomerTypeDTO customerTypeDTO, @PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Update customer type successfully", categoryService.updateCustomerType(customerTypeDTO, id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @DeleteMapping(path = "/customer-type/remove-type/{id}")
    public ResponseEntity<?> deleteCustomerTypeByID(@PathVariable("id") long id) {
        try {
            categoryService.deleteCustomerTypeById(id);
            return response(new ResultEntity(1, "Delete customer type successfully", id));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    /**
     * Distributing Channel
     */
    @PostMapping(path = "/distributing-channel/create")
    public ResponseEntity<?> createChannel(@Valid @RequestBody DistributingChannelDTO distributingChannel) {
        try {
            return response(new ResultEntity(1, "Create distributing channel successfully", categoryService.createDistributingChannel(distributingChannel)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @ApiOperation(value = "Get all distributing channels with pagination and sorting and some conditions")
    @GetMapping(path = "/distributing-channel/get-all")
    public ResponseEntity<?> getAllChannels(
            @RequestParam(value = DefaultConst.PAGE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE) Integer page,
            @RequestParam(value = DefaultConst.PAGE_SIZE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE_SIZE) Integer pageSize,
            @RequestParam(value = DefaultConst.SORT_TYPE, required = false, defaultValue = DefaultConst.STRING) String sortField,
            @RequestParam(value = "sort_asc", required = false, defaultValue = DefaultConst.BOOL) Boolean isSortAsc
    ) {
        try {
            return response(new ResultEntity(1, "Get list distributing channels successfully", categoryService.getAllDistributingChannel(page, pageSize, sortField, isSortAsc)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/distributing-channel/get-channel-by-id/{id}")
    public ResponseEntity<?> getChannelById(@PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Get channel by id successfully", categoryService.getDistributingChannelById(id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/distributing-channel/get-channel-by-code")
    public ResponseEntity<?> getChannelByCode(
            @RequestParam(value = "code", required = true, defaultValue = DefaultConst.STRING) String code) {
        try {
            return response(new ResultEntity(1, "Get channel by code successfully", categoryService.getDistributingChannelByCode(code)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @PutMapping(path = "/distributing-channel/update-channel/{id}")
    public ResponseEntity<?> updateChannel(@Valid @RequestBody DistributingChannelDTO channelDTO, @PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Update distributing channel successfully", categoryService.updateDistributingChannel(channelDTO, id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @DeleteMapping(path = "/distributing-channel/remove-channel/{id}")
    public ResponseEntity<?> deleteChannelById(@PathVariable("id") long id) {
        try {
            categoryService.deleteDistributingChannelById(id);
            return response(new ResultEntity(1, "Delete distributing channel successfully", id));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    /**
     * Contract Type
     */
    @PostMapping(path = "/contract-type/create")
    public ResponseEntity<?> createChannel(@Valid @RequestBody ContractTypeDTO contractTypeDTO) {
        try {
            return response(new ResultEntity(1, "Create contract type successfully", categoryService.createContractType(contractTypeDTO)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @ApiOperation(value = "Get all contract types with pagination and sorting and some conditions")
    @GetMapping(path = "/contract-type/get-all")
    public ResponseEntity<?> getAllContracts(
            @RequestParam(value = DefaultConst.PAGE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE) Integer page,
            @RequestParam(value = DefaultConst.PAGE_SIZE, required = false, defaultValue = DefaultConst.DEFAULT_PAGE_SIZE) Integer pageSize,
            @RequestParam(value = DefaultConst.SORT_TYPE, required = false, defaultValue = DefaultConst.STRING) String sortField,
            @RequestParam(value = "sort_asc", required = false, defaultValue = DefaultConst.BOOL) Boolean isSortAsc
    ) {
        try {
            return response(new ResultEntity(1, "Get list contract types successfully", categoryService.getAllContractType(page, pageSize, sortField, isSortAsc)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/contract-type/get-contract-by-id/{id}")
    public ResponseEntity<?> getContractById(@PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Get contract by id successfully", categoryService.getContractTypeById(id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @GetMapping(path = "/contract-type/get-contract-by-code")
    public ResponseEntity<?> getContractByCode(
            @RequestParam(value = "code", required = true, defaultValue = DefaultConst.STRING) String code) {
        try {
            return response(new ResultEntity(1, "Get contract by code successfully", categoryService.getContractTypeByCode(code)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @PutMapping(path = "/contract-type/update-contract/{id}")
    public ResponseEntity<?> updateContract(@Valid @RequestBody ContractTypeDTO contractTypeDTO, @PathVariable("id") long id) {
        try {
            return response(new ResultEntity(1, "Update contract type successfully", categoryService.updateContractType(contractTypeDTO, id)));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
    @DeleteMapping(path = "/contract-type/remove-contract/{id}")
    public ResponseEntity<?> deleteContractTypeById(@PathVariable("id") long id) {
        try {
            categoryService.deleteContractTypeById(id);
            return response(new ResultEntity(1, "Delete contract type successfully", id));
        } catch (Exception ex) {
            return response(error(ex));
        }
    }
}
