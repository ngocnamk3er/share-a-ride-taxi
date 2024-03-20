import React, { useRef, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import RoutingMachine from "./RoutingMachine";

const icon = L.icon({
    iconUrl: "../../../placeholder.png",
    iconSize: [38, 38],
});

const Map = (props) => {
    const pickupLocation = props.pickupLocation;
    const pickupPosition = [pickupLocation.lat, pickupLocation.lon];
    const myMap = useRef(null);
    const dropoffLocation = props.dropoffLocation;
    const dropoffPosition = [dropoffLocation.lat, dropoffLocation.lon];

    return (
        <MapContainer ref={myMap} style={{ width: "100%", height: "80vh" }} center={pickupPosition} zoom={8} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* <Marker position={pickupPosition} icon={icon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Marker position={dropoffPosition} icon={icon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker> */}
            <RoutingMachine pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} />
        </MapContainer>
    );
}

export default Map;
