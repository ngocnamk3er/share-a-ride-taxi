package openerp.openerpresourceserver.service.Impl;

import com.graphhopper.GHRequest;
import com.graphhopper.GHResponse;
import com.graphhopper.GraphHopper;
import com.graphhopper.ResponsePath;
import com.graphhopper.config.Profile;
import openerp.openerpresourceserver.service.GraphHopperCalculator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.concurrent.ExecutionException;

@Service
public class GraphHopperCalculatorImpl implements GraphHopperCalculator {
    private final GraphHopper graphHopper;

    public GraphHopperCalculatorImpl(@Value("${osm-file-path}") String osmFilePath) {
        this.graphHopper = new GraphHopper();

        graphHopper.setProfiles(
                new Profile("car")
                        .setVehicle("car")
                        .setWeighting("fastest")
                        .setTurnCosts(false)
        );

        graphHopper.setOSMFile(osmFilePath);
        graphHopper.setGraphHopperLocation("target/routing-graph-vietnam-latest-cache");
        graphHopper.importOrLoad();
    }


    @Override
    public ResponsePath calculate(BigDecimal fromLat, BigDecimal fromLon, BigDecimal toLat, BigDecimal toLon) throws Exception {
        GHRequest request = new GHRequest(roundBigDecimal(fromLat), roundBigDecimal(fromLon),
                roundBigDecimal(toLat), roundBigDecimal(toLon))
                .setProfile("car").setLocale(Locale.US);
        GHResponse response = graphHopper.route(request);

        if (response == null) {
            throw new Exception("GraphHopper response is null");
        }

        if (response.getAll().isEmpty()) {
            throw new Exception("GraphHopper response does not contain any results");
        }

        ResponsePath path = response.getBest();
        if (path == null) {
            throw new Exception("Best path not found");
        }
        return path;
    }



    private double roundBigDecimal(BigDecimal b) {
        return b.setScale(6, RoundingMode.HALF_UP).doubleValue();
    }

    private double roundDouble(double b) {
        return Math.round(b * 1e6) / 1e6;
    }
}
