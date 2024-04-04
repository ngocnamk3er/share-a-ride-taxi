import React, { useRef, useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import RoutingMachine from "./RoutingMachine";
import Routing from "./Routing";

const RoutingMapTwoPoint = (props) => {
    const myMap = useRef(null);

    const listLocation = props.listLocation;
    console.log("listLocation in RoutingMapTwoPoint")
    console.log(listLocation)
    const { style } = props;

    return (
        <MapContainer style={style} ref={myMap} center={[16.506, 80.648]} zoom={8} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <RoutingMachine listLocation = {listLocation} />
        </MapContainer>
    );
}

export default RoutingMapTwoPoint;
