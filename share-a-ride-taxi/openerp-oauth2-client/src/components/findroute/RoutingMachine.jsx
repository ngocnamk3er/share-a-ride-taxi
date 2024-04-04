import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {
  const { listLocation } = props;
  const waypoints = listLocation.map(location => L.latLng(location.lat, location.lon));

  const waypointIcon = L.icon({
    iconUrl: require('../../assets/img/placeholder.png'), // Đường dẫn đến biểu tượng của bạn
    iconSize: [25, 41], // Kích thước của biểu tượng (điều chỉnh theo nhu cầu)
    iconAnchor: [12, 41], // Điểm neo của biểu tượng (điều chỉnh theo nhu cầu)
  });

  const instance = L.Routing.control({

    waypoints: waypoints,
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    waypointIcon: waypointIcon,
    show: true,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
