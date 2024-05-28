import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField, Button } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { request } from "../../api";
import { CircularProgress } from "@mui/material";
import WarehouseRoute from "../../components/route/warehouse-route/WarehouseRoute"
import routeStatusMap from "config/statusMap";

const DetailWarehouseRoute = () => {
    const [routeWarehouse, setRouteWarehouse] = useState(null);
    const [driver, setDriver] = useState(null);
    const [startWarehouse, setStartWarehouse] = useState(null);
    const [dropOffWarehouses, setDropOffWarehouses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const match = useRouteMatch();
    const { id } = match.params;



    useEffect(() => {
        fetchRouteWarehouse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (routeWarehouse) {
            console.log("check routeWarehouse : ", routeWarehouse)
            fetchDriver();
            fetchStartWarehouse()
            fetchDropOffWarehouses();
        }
    }, [routeWarehouse])

    const fetchRouteWarehouse = async () => {
        try {
            const response = await request('get', `/route-warehouses/${id}`);
            setRouteWarehouse(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStartWarehouse = async () => {
        try {
            const response = await request('get', `/warehouses/${routeWarehouse.startWarehouseId}`);
            setStartWarehouse(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchDriver = async () => {
        try {
            const response = await request('get', `/drivers/user/${routeWarehouse.driverId}`);
            setDriver(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchDropOffWarehouses = async () => {
        try {
            const response = await request('get', `/warehouses/by-warehouse-route/${id}`);
            setDropOffWarehouses(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(()=>{
        if (driver && startWarehouse && dropOffWarehouses) {
            console.log("check all")
            console.log(driver)
            console.log(startWarehouse)
            console.log(dropOffWarehouses)
        }
    },[driver,startWarehouse, dropOffWarehouses])

    if (loading) return <CircularProgress />;
    if (!(driver && startWarehouse && dropOffWarehouses)) return <CircularProgress />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <h1>Route {id} Details</h1>
            <WarehouseRoute style={{ width: "100%", height: "80vh" }}
                driver={driver}
                startWarehouse={startWarehouse}
                listLocation={dropOffWarehouses}
            />
            <br />
            {WarehouseRoute && (
                <div>
                    <TextField
                        label="Start warehouse id"
                        value={WarehouseRoute.startWarehouseId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Driver ID"
                        value={WarehouseRoute.driverId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Start Execute Time"
                        value={WarehouseRoute.startExecuteStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="End Time"
                        value={WarehouseRoute.endStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Route Status ID"
                        value={routeStatusMap[WarehouseRoute.routeStatusId]}
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
export default withScreenSecurity(DetailWarehouseRoute, SCR_ID, true);
