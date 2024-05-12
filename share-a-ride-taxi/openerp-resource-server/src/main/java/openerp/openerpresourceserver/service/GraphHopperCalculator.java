package openerp.openerpresourceserver.service;

import com.graphhopper.ResponsePath;

import java.math.BigDecimal;

public interface GraphHopperCalculator {
    ResponsePath calculate(BigDecimal fromLat, BigDecimal fromLon, BigDecimal toLat, BigDecimal toLon) throws Exception;
}
