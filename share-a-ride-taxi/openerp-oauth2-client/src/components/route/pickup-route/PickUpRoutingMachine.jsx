import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import 'leaflet-textpath'; // Import Leaflet.TextPath

const createRoutineMachineLayer = (props) => {
  const { driver, warehouse, combinedRequests, isDriver } = props;

  const waypoints = [
    L.latLng(driver.lat, driver.lon),
    ...combinedRequests.flatMap((request) => {
      if (request.type === "passenger-request") {
        return [
          L.latLng(request.pickupLatitude, request.pickupLongitude),
          L.latLng(request.dropoffLatitude, request.dropoffLongitude)
        ];
      } else {
        return L.latLng(request.pickupLatitude, request.pickupLongitude);
      }
    }),
    L.latLng(warehouse.lat, warehouse.lon)
  ];

  // Import your custom icon images
  const iconUrls = [
    require(`../../../assets/img/driver.png`),
    ...combinedRequests.flatMap((request, i) => {
      if (request.type === "passenger-request") {
        return [
          require(`../../../assets/img/passengerPickUp${i + 1}.png`),
          require(`../../../assets/img/placeholder.png`)
        ];
      } else {
        return [
          require(`../../../assets/img/parcelPickUp${i + 1}.png`)
        ];
      }
    }),
    require(`../../../assets/img/warehouse.png`)
  ];

  // Define your custom icons
  const customIcons = iconUrls.map(url =>
    L.icon({
      iconUrl: url,
      iconSize: [48, 48], // Adjust the size as needed
      iconAnchor: [24, 48], // Adjust the anchor point if needed
    })
  );

  let runningPointMarker = null;

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

      line.on('mouseover', function () {
        this.setText('  ►  ', {
          repeat: true,
          attributes: {
            fill: 'green'
          }
        });
      });

      line.on('mouseout', function () {
        this.setText(null);
      });

      return line;
    }
  });

  // Function to simulate running point along the route
  function simulateRunningPoint(route) {
    let index = 0;
    let timer = setInterval(function () {
      if (runningPointMarker) {
        runningPointMarker.setLatLng(route.coordinates[index]);
      } else {
        runningPointMarker = L.marker(route.coordinates[index], {
          icon: L.divIcon({
            className: 'running-point-icon',
            html: '►',
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          }),
        }).addTo(instance._map);
      }

      index++;

      if (index >= route.coordinates.length) {
        clearInterval(timer);
      }
    }, 1000); // Move every 1 second
  }

  instance.on('routesfound', function (e) {
    const route = e.routes[0].coordinates;
    simulateRunningPoint(route);
  });

  return instance;
};

const PickUpRoutingMachine = createControlComponent(createRoutineMachineLayer);

export default PickUpRoutingMachine;
