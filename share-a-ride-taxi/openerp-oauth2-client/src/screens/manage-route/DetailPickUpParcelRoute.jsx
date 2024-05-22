import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField, Button } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { request } from "../../api";
import { CircularProgress } from "@mui/material";
import RoutingMapTwoPoint from '../../components/findroute/RoutingMapTwoPoint';

const DetailPickUpParcelRoute = () => {
    const [routePickup, setRoutePickup] = useState(null);
    const [routePickupDetailList, setRoutePickupDetailList] = useState(null);
    const [pickUpRequests, setPickUpRequests] = useState(null);
    const [reqLocations, setReqLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const match = useRouteMatch();
    const history = useHistory();
    const { id } = match.params;

    const routeStatusMap = {
        0: "Not Ready",
        1: "Ready",
        2: "Start",
        3: "Complete"
    };

    const fetchRoutePickup = async () => {
        try {
            const response = await request('get', `/route-pickups/${id}`);
            setRoutePickup(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoutePickupDetailList = async () => {
        try {
            const response = await request('get', `/route-pickup-details/by-route/${id}`);
            setRoutePickupDetailList(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchPickUpRouteRequests = async () => {
        try {
            const response = await request('get', `/parcel-requests/by-pickup-route/${id}`);
            setPickUpRequests(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutePickup();
        fetchRoutePickupDetailList();
        fetchPickUpRouteRequests();
    }, [id]);

    useEffect(() => {
        console.log("check reqLocations : ", reqLocations)
    }, [reqLocations]);

    useEffect(() => {
        console.log("check pickUpRequests : ", pickUpRequests)
        if (pickUpRequests != null) {
            setReqLocations(pickUpRequests.map((req) => {
                return {
                    lat: req.pickupLatitude,
                    lon: req.pickupLongitude,
                    address: req.pickupAddress
                };
            }))
        }
    }, [pickUpRequests]);



    const handleRefresh = () => {
        setLoading(true);
        setError(null);
        setRoutePickup(null);
        fetchRoutePickup();
    };

    if (loading) return <CircularProgress />;
    if (reqLocations == null) return <CircularProgress />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <h1>Route {id} Details</h1>
            <RoutingMapTwoPoint style={{ width: "100%", height: "80vh" }}
                listLocation={reqLocations}
            />
            <br />
            {routePickup && (
                <div>
                    <TextField
                        label="Warehouse ID"
                        value={routePickup.wareHouseId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Driver ID"
                        value={routePickup.driverId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Start Execute Time"
                        value={routePickup.startExecuteStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="End Time"
                        value={routePickup.endStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Route Status ID"
                        value={routeStatusMap[routePickup.routeStatusId]}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                </div>
            )}
        </div>
    );
};

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(DetailPickUpParcelRoute, SCR_ID, true);
