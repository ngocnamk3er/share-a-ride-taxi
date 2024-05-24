import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import WarehouseRoutingMachine from "./WarehouseRoutingMachine";

function ResetCenterView(props) {
    const { center } = props;
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(
                L.latLng(center[0], center[1]),
                12,
                map.getZoom(),
                {
                    animate: true,
                }
            );
        }
    }, [center, map]);

    return null;
}

const WarehouseRoute = (props) => {
    const center = props.center ? props.center : [21.0283334, 105.854041];
    const { driver } = props;
    const { startWarehouse } = props;
    const { listLocation } = props;
    const { style } = props;


    return (
        <>
            <MapContainer style={style} center={center} zoom={8} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <WarehouseRoutingMachine listLocation={listLocation} driver={driver} startWarehouse={startWarehouse} />
                <ResetCenterView center={center} />
            </MapContainer>
        </>
    );
};

export default WarehouseRoute;
