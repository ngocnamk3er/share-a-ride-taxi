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


    // "id": "370c76d7-af30-4c78-86ce-ec6fe55ed126",
    // "routeId": "ben-store_pickup_route_30_5",
    // "requestId": "5c6774ca-9d5a-408a-8d12-47798b04452d",
    // "visited": false,
    // "seqIndex": 4,
    // "lastUpdatedStamp": "2024-05-20T15:12:08.253674",
    // "createdStamp": "2024-05-20T15:12:08.253674"

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
            {routePickup && (
                <div>
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
                        label="Last Updated Time"
                        value={routePickup.lastUpdatedStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Created Time"
                        value={routePickup.createdStamp}
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
                        value={routePickup.routeStatusId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Warehouse ID"
                        value={routePickup.wareHouseId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button> */}
                    {/* <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => history.push('/edit-route/' + id)}
                        style={{ marginLeft: '10px' }}
                    >
                        Edit
                    </Button> */}
                </div>
            )}
            <RoutingMapTwoPoint style={{ width: "100%", height: "80vh" }}
                listLocation={reqLocations}
            />
        </div>
    );
};

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(DetailPickUpParcelRoute, SCR_ID, true);
