import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { Typography, CircularProgress, Grid } from "@mui/material";
import './AddRequestToRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../api";
import RoutingMapTwoPoint from '../../components/findroute/RoutingMapTwoPoint';


const DetailRoute = () => {
    const { routeId } = useParams();
    const [listLocation, setListLocation] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRouteDetail = await request("get", `/route-details/search?routeId=${routeId}`);
                const routeDetail = resRouteDetail.data;
                const resPassengerRequest = await request("get", `/passenger-requests`);
                const passengerRequest = resPassengerRequest.data;

                const newLocations = passengerRequest.reduce((acc, curr) => {
                    routeDetail.forEach(route => {
                        if (route.requestId === curr.id) {
                            acc.push({ lat: curr.pickupLocationLatitude, lon: curr.pickupLocationLongitude });
                            acc.push({ lat: curr.dropoffLocationLatitude, lon: curr.dropoffLocationLongitude });
                        }
                    });
                    return acc;
                }, []);

                setListLocation(newLocations);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [routeId]);

    if (listLocation.length == 0) {
        return <CircularProgress />;
    }

    return (
        <RoutingMapTwoPoint style={{ width: "100%", height: "80vh" }} listLocation={listLocation} />
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailRoute, SCR_ID, true);
