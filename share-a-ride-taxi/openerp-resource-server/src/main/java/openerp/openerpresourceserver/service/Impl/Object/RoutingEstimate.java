package openerp.openerpresourceserver.service.Impl.Object;

public class RoutingEstimate {
    private double distance;
    private int time;

    public RoutingEstimate(double distance, int time) {
        this.distance = distance;
        this.time = time;
    }

    // Getters and setters
    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }
}
