import React, { useRef, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import RoutingMachine from "./RoutingMachine";
import Routing from "./Routing";

const RoutingMap = (props) => {
    const pickupLocation = props.pickupLocation;
    const pickupPosition = [pickupLocation.lat, pickupLocation.lon];
    const myMap = useRef(null);
    const dropoffLocation = props.dropoffLocation;

    return (
        <MapContainer ref={myMap} style={{ width: "100%", height: "80vh" }} center={pickupPosition} zoom={8} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RoutingMachine pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
        </MapContainer>
    );
}

export default RoutingMap;
