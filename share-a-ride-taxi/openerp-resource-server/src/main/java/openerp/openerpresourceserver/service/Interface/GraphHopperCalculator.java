package openerp.openerpresourceserver.service.Interface;

import com.graphhopper.ResponsePath;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;

import java.math.BigDecimal;

public interface GraphHopperCalculator {
    ResponsePath calculate(BigDecimal fromLat, BigDecimal fromLon, BigDecimal toLat, BigDecimal toLon) throws Exception;
    ResponsePath calculate(Coordinate start, Coordinate end) throws Exception;
}
