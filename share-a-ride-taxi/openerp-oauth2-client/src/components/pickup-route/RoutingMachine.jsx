import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";


const createRoutineMachineLayer = (props) => {
  const { listLocation } = props;
  const { driver } = props;
  const { warehouse } = props;

  console.log("check listLocation : ", listLocation);



  const waypoints = [
    L.latLng(driver.lat, driver.lon),
    ...listLocation.map((location) => L.latLng(location.lat, location.lon)),
    L.latLng(warehouse.lat, warehouse.lon)
  ];

  // Import your custom icon images
  const iconUrls = [];

  iconUrls.push(require(`../../assets/img/driver.png`));

  for (let i = 0; i < listLocation.length; i++) {
    iconUrls.push(require(`../../assets/img/${i + 1}.png`));
  }

  iconUrls.push(require(`../../assets/img/warehouse.png`));

  // Define your custom icons
  const customIcons = iconUrls.map(url =>
    L.icon({
      iconUrl: url,
      iconSize: [48, 48], // Adjust the size as needed
      iconAnchor: [16, 32], // Adjust the anchor point if needed
    })
  );

  const instance = L.Routing.control({
    waypoints: waypoints,
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }],
    },
    createMarker: function (i, waypoint, n) {
      // Create a marker with a custom icon
      const marker = L.marker(waypoint.latLng, {
        draggable: false,
        icon: customIcons[i],
      });

      if (i === 0) {
        marker.bindPopup(driver.address);
      } else if (i === waypoint.length - 1){
        marker.bindPopup(listLocation[i + 1]);
      }else{
        marker.bindPopup(warehouse.address);
      }

      return marker;
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
