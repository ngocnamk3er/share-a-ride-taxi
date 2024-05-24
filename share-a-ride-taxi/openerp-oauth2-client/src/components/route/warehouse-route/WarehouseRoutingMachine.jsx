import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import 'leaflet-textpath'; // Import Leaflet.TextPath

const createRoutineMachineLayer = (props) => {
  const { driver, startWarehouse, listLocation } = props;

  const waypoints = [
    L.latLng(driver.lat, driver.lon),
    L.latLng(startWarehouse.lat, startWarehouse.lon),
    ...listLocation.map((location) => L.latLng(location.lat, location.lon)),
  ];

  // Import your custom icon images
  const iconUrls = [
    require(`../../../assets/img/driver.png`),
    require(`../../../assets/img/warehouse.png`),
    ...listLocation.map((_, i) => require(`../../../assets/img/warehouse2.png`)),
  ];

  // Define your custom icons
  const customIcons = iconUrls.map(url =>
    L.icon({
      iconUrl: url,
      iconSize: [48, 48], // Adjust the size as needed
      iconAnchor: [24, 48], // Adjust the anchor point if needed
    })
  );

  const instance = L.Routing.control({
    waypoints: waypoints,
    lineOptions: {
      styles: [
        {
          color: "#6FA1EC",
          weight: 5,
          opacity: 0.75,
          lineCap: 'butt',
          smoothFactor: 1
        }
      ],
    },
    createMarker: function (i, waypoint, n) {
      // Create a marker with a custom icon
      const marker = L.marker(waypoint.latLng, {
        draggable: false,
        icon: customIcons[i],
      });

      if (i === 0) {
        marker.bindPopup(driver.address).openPopup();
      } else if (i === 1) {
        marker.bindPopup(startWarehouse.address).openPopup();
      } else {
        marker.bindPopup(listLocation[i - 2].address).openPopup();
      }
      return marker;
    },
    routeLine: function (route) {
      const line = L.polyline(route.coordinates, {
        color: '#6FA1EC',
        weight: 5,
        opacity: 0.75,
        lineCap: 'butt',
        smoothFactor: 1
      });

      line.setText('  ►  ', {
        repeat: true,
        attributes: {
          fill: 'green'
        }
      });

      // line.on('mouseover', function() {
      //   this.setText('  ►  ', {
      //     repeat: true,
      //     attributes: {
      //       fill: 'green'
      //     }
      //   });
      // });

      // line.on('mouseout', function() {
      //   this.setText(null);
      // });

      return line;
    }
  });

  return instance;
};

const WarehouseRoutingMachine = createControlComponent(createRoutineMachineLayer);

export default WarehouseRoutingMachine;
