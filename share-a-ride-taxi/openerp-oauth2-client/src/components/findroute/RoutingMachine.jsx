import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

const createRoutineMachineLayer = (props) => {
  const { pickupLocation, dropoffLocation } = props;
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(pickupLocation.lat, pickupLocation.lon),
      L.latLng(dropoffLocation.lat, dropoffLocation.lon),
      L.latLng(19.9781573, 105.4816107)
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
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
