import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';


function ResetCenterView(props) {
    let { locations, center } = props;
    const map = useMap();
    if (!center) center = locations[0]

    useEffect(() => {
        if (center) {
            map.setView(
                L.latLng(center.lat, center.lon),
                map.getZoom(),
                {
                    animate: true
                }
            )
        }
    }, [center, map]);

    return null;
}

const MultiLocationMap = ({ locations, center }) => {
    const iconUrls = [];

    for (let i = 0; i < locations.length; i++) {
        iconUrls.push(require(`../../assets/img/${i + 1}.png`));
    }
    // Define your custom icons
    const customIcons = iconUrls.map(url =>
        L.icon({
            iconUrl: url,
            iconSize: [48, 48], // Adjust the size as needed
            iconAnchor: [16, 32], // Adjust the anchor point if needed
        })
    );



    return (
        <MapContainer center={[0, 0]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((location, index) => (
                <Marker key={index} position={[location.lat, location.lon]} icon={customIcons[index]}>
                    <Popup>
                        <div>
                            <strong>Warehouse ID:</strong> {location.warehouseId}
                        </div>
                        <div>
                            <strong>Warehouse Name:</strong> {location.warehouseName}
                        </div>
                        <div>
                            <strong>Address:</strong> {location.address}
                        </div>
                        <div>
                            <strong>Address note:</strong> {location.addressNote}
                        </div>
                    </Popup>
                </Marker>
            ))}
            <ResetCenterView locations={locations} center={center} />
        </MapContainer>
    );
};

export default MultiLocationMap;
