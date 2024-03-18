package openerp.openerpresourceserver.service.Impl;

import openerp.openerpresourceserver.entity.Location;
import openerp.openerpresourceserver.repo.LocationRepository;
import openerp.openerpresourceserver.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class LocationServiceImpl implements LocationService {

    private LocationRepository locationRepository;

    @Autowired
    public LocationServiceImpl(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    @Override
    public Location getLocationById(UUID id) {
        return locationRepository.findById(id).orElse(null);
    }

    @Override
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    @Override
    public Location saveLocation(Location location) {
        return locationRepository.save(location);
    }

    @Override
    public void deleteLocation(UUID id) {
        locationRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Location updateLocation(UUID id, Location newLocation) {
        Optional<Location> optionalLocation = locationRepository.findById(id);
        if (optionalLocation.isPresent()) {
            Location existingLocation = optionalLocation.get();
            if (newLocation.getLatitude() != null) {
                existingLocation.setLatitude(newLocation.getLatitude());
            }
            if (newLocation.getLongitude() != null) {
                existingLocation.setLongitude(newLocation.getLongitude());
            }
            if (newLocation.getAddress() != null && !newLocation.getAddress().isEmpty()) {
                existingLocation.setAddress(newLocation.getAddress());
            }
            return locationRepository.save(existingLocation);
        }
        return null; // Trả về null nếu không tìm thấy đối tượng
    }
}
