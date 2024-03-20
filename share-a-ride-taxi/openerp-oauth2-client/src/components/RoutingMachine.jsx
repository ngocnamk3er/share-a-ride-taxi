import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";

// Import biểu tượng

const createRoutineMachineLayer = (props) => {
  const { pickupLocation, dropoffLocation } = props;

  const startIcon = L.icon({
    iconUrl: "../../../placeholder.png",
    iconSize: [38, 38],
  });

  const endIcon = L.icon({
    iconUrl: "../../../placeholder.png",
    iconSize: [38, 38],
  });

  const instance = L.Routing.control({
    waypoints: [
      L.latLng(pickupLocation.lat, pickupLocation.lon),
      L.latLng(dropoffLocation.lat, dropoffLocation.lon)
    ],
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: false,
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
