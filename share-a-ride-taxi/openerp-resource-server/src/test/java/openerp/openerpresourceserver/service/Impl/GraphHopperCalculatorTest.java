package openerp.openerpresourceserver.service.Impl;

import com.graphhopper.ResponsePath;
import openerp.openerpresourceserver.service.Impl.GraphHopperCalculatorImpl;
import openerp.openerpresourceserver.service.Impl.Object.Coordinate;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

@SpringBootTest
public class GraphHopperCalculatorTest {

    @Autowired
    GraphHopperCalculatorImpl graphHopperCalculator;

    @Test
    public void calculateTest1() {
        BigDecimal startLat = BigDecimal.valueOf(21.0283334);
        BigDecimal startLon = BigDecimal.valueOf(105.854041);
        BigDecimal endLat = BigDecimal.valueOf(19.9781573);
        BigDecimal endLon = BigDecimal.valueOf(105.4816107);

        ResponsePath path;
        try {
            path = graphHopperCalculator.calculate(startLat, startLon, endLat, endLon);
            if (path == null) {
                System.out.println("ResponsePath is null");
            } else {
//                System.out.println("ResponsePath: " + path.toString());
                System.out.println("Time : " + path.getTime());
                System.out.println("Distance : " + path.getDistance());
            }
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
        }

    }

    @Test
    public void calculateTest2() {
        Coordinate start = new Coordinate(BigDecimal.valueOf(21.0283334), BigDecimal.valueOf(105.854041));
        Coordinate end = new Coordinate(BigDecimal.valueOf(19.9781573), BigDecimal.valueOf(105.4816107));

        ResponsePath path;
        try {
            path = graphHopperCalculator.calculate(start, end);
            if (path == null) {
                System.out.println("ResponsePath is null");
            } else {
//                System.out.println("ResponsePath: " + path.toString());
                System.out.println("Time : " + path.getTime());
                System.out.println("Distance : " + path.getDistance());
            }
        } catch (Exception e) {
            System.out.println("Exception occurred: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
