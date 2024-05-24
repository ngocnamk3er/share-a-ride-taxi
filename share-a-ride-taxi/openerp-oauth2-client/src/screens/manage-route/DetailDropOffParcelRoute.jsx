import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { request } from "../../api";
import { CircularProgress } from "@mui/material";
import DropOffRoute from "components/route/dropoff-route/DropOffRoute";


const DetailDropOffParcelRoute = () => {
    const [routeDropOff, setRouteDropOff] = useState(null);
    const [driver, setDriver] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [dropOffRequests, setDropOffRequests] = useState(null);
    const [reqLocations, setReqLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const match = useRouteMatch();
    const { id } = match.params;

    const routeStatusMap = {
        0: "Not Ready",
        1: "Ready",
        2: "Start",
        3: "Complete"
    };

    const fetchRouteDropOff = async () => {
        try {
            const response = await request('get', `/route-dropoffs/${id}`);
            setRouteDropOff(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDropOffRouteRequests = async () => {
        try {
            const response = await request('get', `/parcel-requests/by-drop-off-route/${id}`);
            setDropOffRequests(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDriver = async (driverId) => {
        try {
            const response = await request('get', `/drivers/user/${driverId}`);
            setDriver(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const fetchWarehouse = async (warehouseId) => {
        try {
            const response = await request('get', `/warehouses/${warehouseId}`);
            setWarehouse(response.data);
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        fetchRouteDropOff();
        fetchDropOffRouteRequests();
    }, [id]);

    useEffect(() => {
        console.log("check reqLocations : ", reqLocations)
    }, [reqLocations]);

    useEffect(() => {
        if (routeDropOff) {
            console.log("check routeDropOff : ", routeDropOff)
            fetchDriver(routeDropOff.driverId);
            fetchWarehouse(routeDropOff.wareHouseId);
        }
    }, [routeDropOff])

    useEffect(() => {
        if (driver && warehouse) {
            console.log("check driver : ", driver)
            console.log("check warehouse : ", warehouse)
        }

    }, [driver, warehouse])

    useEffect(() => {
        console.log("check dropOffRequests : ", dropOffRequests)
        if (dropOffRequests != null) {
            setReqLocations(dropOffRequests.map((req) => {
                return {
                    lat: req.dropoffLatitude,
                    lon: req.dropoffLongitude,
                    address: req.dropoffAddress
                };
            }))
        }
    }, [dropOffRequests]);


    useEffect(()=>{
        if(reqLocations && driver && warehouse){
            console.log("okok")
        }
    },[reqLocations,driver,warehouse])

    if (loading) return <CircularProgress />;
    if (!(reqLocations && driver && warehouse)) return <CircularProgress />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <h1>Route {id} Details</h1>
            <DropOffRoute style={{ width: "100%", height: "80vh" }}
                listLocation={reqLocations}
                driver={driver}
                warehouse={warehouse}
            />
            <br />
            {routeDropOff && (
                <div>
                    <TextField
                        label="Warehouse ID"
                        value={routeDropOff.wareHouseId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Driver ID"
                        value={routeDropOff.driverId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Start Execute Time"
                        value={routeDropOff.startExecuteStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="End Time"
                        value={routeDropOff.endStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Route Status ID"
                        value={routeStatusMap[routeDropOff.routeStatusId]}
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
export default withScreenSecurity(DetailDropOffParcelRoute, SCR_ID, true);
