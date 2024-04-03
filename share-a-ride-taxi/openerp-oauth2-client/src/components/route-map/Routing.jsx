import React from "react";
import { Marker, Popup } from "react-leaflet";

const Routing = ({ item }) => {
    const pickupPosition = [item.pickupLocationLatitude, item.pickupLocationLongitude];
    const dropoffPosition = [item.dropoffLocationLatitude, item.dropoffLocationLongitude];

    return (
        <>
            <Marker position={pickupPosition}>
                <Popup>{item.pickupLocationAddress}</Popup>
            </Marker>
            <Marker position={dropoffPosition}>
                <Popup>{item.dropoffLocationAddress}</Popup>
            </Marker>
        </>
    );
};

export default Routing;
