import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
    iconUrl: "../../../placeholder.png",
    iconSize: [38, 38],
});

const Map = (props) => {
    const pickupLocation = props.pickupLocation;
    const pickupPosition = [pickupLocation.lat, pickupLocation.lon];
    
    const dropoffLocation = props.dropoffLocation;
    const dropoffPosition = [dropoffLocation.lat, dropoffLocation.lon];

    return (
        <MapContainer style={{ width: "100%", height: "80vh" }} center={pickupPosition} zoom={8} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=S2AoXO1T66lM1OcyaD9F"
            />
            <Marker position={pickupPosition} icon={icon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Marker position={dropoffPosition} icon={icon}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    );
}

export default Map;
