package openerp.openerpresourceserver.controller;

import lombok.RequiredArgsConstructor;
import openerp.openerpresourceserver.entity.Location;
import openerp.openerpresourceserver.service.Interface.LocationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/locations")
@RequiredArgsConstructor

public class LocationController {

    private final LocationService locationService;


    @GetMapping
    public List<Location> getAllLocations() {
        return locationService.getAllLocations();
    }

    @GetMapping("/{id}")
    public Location getLocationById(@PathVariable UUID id) {
        return locationService.getLocationById(id);
    }

    @PostMapping
    public Location createLocation(@RequestBody Location location) {
        return locationService.saveLocation(location);
    }

    @PutMapping("/{id}")
    public Location updateLocation(@PathVariable UUID id, @RequestBody Location newLocation) {
        Location existLocation = locationService.getLocationById(id);
        existLocation.setLatitude(newLocation.getLatitude());
        existLocation.setLongitude(newLocation.getLongitude());
        existLocation.setAddress(newLocation.getAddress());
        return locationService.saveLocation(newLocation);
    }

    @DeleteMapping("/{id}")
    public void deleteLocation(@PathVariable UUID id) {
        locationService.deleteLocation(id);
    }
}
