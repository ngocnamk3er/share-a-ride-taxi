import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { useMap } from "react-leaflet";


export default function Routing(props) {
    const { listLocation } = props;

    console.log('Routingx')

    const waypoints = listLocation.map((location, index) =>
        L.latLng(location.lat, location.lon)
    );

    const iconUrls = [];
    for (let i = 0; i < listLocation.length; i++) {
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

    const map = useMap();

    useEffect(() => {
        if (!map) return;

        const routingControl = L.Routing.control({
            waypoints: waypoints,
            lineOptions: {
                styles: [{ color: "#6FA1EC", weight: 4 }],
            },
            createMarker: function (i, waypoint, n) {
                // Use the custom icon for markers
                return L.marker(waypoint.latLng, {
                    draggable: false,
                    icon: customIcons[i]
                });
            },
            show: true,
            addWaypoints: false,
            routeWhileDragging: true,
            draggableWaypoints: true,
            fitSelectedRoutes: true,
            fitWaypoints: false,
            showAlternatives: false,
        }).addTo(map);

        return () => map.removeControl(routingControl);
    }, [customIcons, map, waypoints]);

    return null;
}
