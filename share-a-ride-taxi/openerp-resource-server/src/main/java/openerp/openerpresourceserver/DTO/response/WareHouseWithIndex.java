package openerp.openerpresourceserver.DTO.response;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class WareHouseWithIndex {
    private String warehouseId;
    private String warehouseName;
    private String address;
    private String addressNote;
    private BigDecimal lat;
    private BigDecimal lon;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdByUserId;
    private boolean visited;
    private Integer seqIndex;
    private UUID id;
}
