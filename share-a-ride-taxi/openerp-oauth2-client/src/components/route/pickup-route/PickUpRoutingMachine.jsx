import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import 'leaflet-textpath'; // Import Leaflet.TextPath

const createRoutineMachineLayer = (props) => {
  const { listLocation, driver, warehouse, combinedRequests } = props;

  console.log("check combinedRequests in createRoutineMachineLayer", combinedRequests)

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

  console.log("check waypoints : ", waypoints)
  console.log("check combinedRequests in createRoutineMachineLayer : ", combinedRequests)

  // Import your custom icon images
  const iconUrls = [
    require(`../../../assets/img/driver.png`),
    // ...listLocation.map((_, i) => require(`../../../assets/img/${i + 1}.png`)),
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

      // if (i === 0) {
      //   marker.bindPopup(driver.address).openPopup();
      // } else if (i === waypoints.length - 1) {
      //   marker.bindPopup(warehouse.address).openPopup();
      // } else {
      //   marker.bindPopup(listLocation[i - 1].address).openPopup();
      // }
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

      // line.setText('  ►  ', {
      //   repeat: true,
      //   attributes: {
      //     fill: 'green'
      //   }
      // });

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

  return instance;
};

const PickUpRoutingMachine = createControlComponent(createRoutineMachineLayer);

export default PickUpRoutingMachine;
