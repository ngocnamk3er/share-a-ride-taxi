package openerp.openerpresourceserver.service.Impl.Object;

import java.math.BigDecimal;

public class RoutingEstimate {
    private BigDecimal distance;
    private int time;

    public RoutingEstimate(BigDecimal distance, int time) {
        this.distance = distance;
        this.time = time;
    }

    // Getters and setters
    public BigDecimal getDistance() {
        return distance;
    }

    public void setDistance(BigDecimal distance) {
        this.distance = distance;
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }
}
