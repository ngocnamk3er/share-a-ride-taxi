import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PickUpRoutingMachine from "./PickUpRoutingMachine";

function ResetCenterView(props) {
    const { center } = props;
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(
                L.latLng(center[0], center[1]),
                48,
                map.getZoom(),
                {
                    animate: true,
                }
            );
        }
    }, [center, map]);

    return null;
}

const PickUpRoute = (props) => {
    const center = props.center ? props.center : [21.0283334, 105.854041];
    const { listLocation } = props;
    const { driver } = props;
    const { warehouse } = props;
    const { style } = props;
    const { combinedRequests } = props;
    const { isDriver } = props;

    console.log("check combinedRequests in PickUpRoute : ", combinedRequests)

    return (
        <>
            <MapContainer style={style} center={center} zoom={8} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <PickUpRoutingMachine
                    listLocation={listLocation}
                    driver={driver}
                    warehouse={warehouse}
                    combinedRequests={combinedRequests}
                    isDriver={isDriver}
                />
                <ResetCenterView center={center} />
            </MapContainer>
        </>
    );
};

export default PickUpRoute;
