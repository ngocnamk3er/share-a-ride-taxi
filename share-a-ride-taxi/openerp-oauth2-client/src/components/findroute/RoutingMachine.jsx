import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";


const createRoutineMachineLayer = (props) => {
  const { listLocation } = props;
  const waypoints = listLocation.map((location, index) =>
    L.latLng(location.lat, location.lon)
  );

  // Import your custom icon images
  const iconUrls = [];
  for (let i = 0; i < listLocation.length; i++) {
    iconUrls.push(require(`../../assets/img/${i + 1}.png`));
  }

  // Define your custom icons
  const customIcons = iconUrls.map(url =>
    L.icon({
      iconUrl: url,
      iconSize: [32, 32], // Adjust the size as needed
      iconAnchor: [16, 32], // Adjust the anchor point if needed
    })
  );

  const instance = L.Routing.control({
    waypoints: waypoints,
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
    },
    createMarker: function (i, waypoint, n) {
      // Use the custom icon for markers
      return L.marker(waypoint.latLng, {
        draggable: false,
        icon: customIcons[i]
      });
    },
    show: true,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
