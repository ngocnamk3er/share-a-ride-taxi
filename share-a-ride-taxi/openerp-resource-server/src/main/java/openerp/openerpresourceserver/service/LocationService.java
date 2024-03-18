package openerp.openerpresourceserver.service;

import openerp.openerpresourceserver.entity.Location;

import java.util.List;
import java.util.UUID;

public interface LocationService {
    Location getLocationById(UUID id);
    List<Location> getAllLocations();
    Location saveLocation(Location location);
    void deleteLocation(UUID id);
    Location updateLocation(UUID id, Location newLocation);
}
