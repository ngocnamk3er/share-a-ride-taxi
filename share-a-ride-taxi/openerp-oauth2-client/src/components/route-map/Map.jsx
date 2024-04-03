import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Routing from "./Routing";

const Map = (props) => {
    const { data } = props;
    const defaultCenter = [20.9, 106.7]; // Tọa độ mặc định để hiển thị bản đồ

    return (
        <MapContainer center={defaultCenter} zoom={6} style={{ height: "400px" }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {data.map(item => (
                <Routing key={item.id} item={item} />
            ))}
        </MapContainer>
    );
};

export default Map;
