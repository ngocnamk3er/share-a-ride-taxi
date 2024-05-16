package openerp.openerpresourceserver.service.Interface;

import openerp.openerpresourceserver.entity.Location;

import java.util.List;
import java.util.UUID;

public interface LocationService {
    Location getLocationById(UUID id);
    List<Location> getAllLocations();
    Location saveLocation(Location location);
    void deleteLocation(UUID id);
}
