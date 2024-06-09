import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField, Grid, IconButton, Chip, CircularProgress, Button } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { request } from "../../api";
import WarehouseRoute from "../../components/route/warehouse-route/WarehouseRoute"
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { routeStatusMap, routeStatusMapReverse, getStatusColor } from "config/statusMap";

const DetailWarehouseRoute = (props) => {
    const { isDriver } = props;
    const [routeWarehouse, setRouteWarehouse] = useState(null);
    const [driver, setDriver] = useState(null);
    const [startWarehouse, setStartWarehouse] = useState(null);
    const [dropOffWarehouses, setDropOffWarehouses] = useState([]);
    const [passengerRequests, setPassengerRequests] = useState([]);
    const [combinedRequests, setCombinedRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const match = useRouteMatch();
    const { id } = match.params;
    const history = useHistory();

    const columnsCombined = [
        {
            title: "Name",
            field: "name",
            render: rowData => (
                rowData.type === "passenger-request" ? `passenger-request of ${rowData.passengerName}` : `transit warehouse ${rowData.warehouseName}`
            )
        },
        {
            title: "View",
            sorting: false,
            cellStyle: { width: '10px', padding: '0px', textAlign: 'center' },
            headerStyle: { width: '10px', padding: '0px', textAlign: 'center' },
            render: (rowData) => (
                <IconButton
                    style={{
                        width: 50,
                    }}
                    onClick={() => {
                        // handleViewClick(rowData);
                    }}
                    variant="contained"
                    color="primary"
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
        {
            title: "Done",
            field: "visited",
            render: rowData => (
                <IconButton
                    onClick={() => handleActivateClick(rowData)}
                    color={rowData.visited ? 'primary' : 'text.disabled'}
                >
                    <CheckCircleIcon />
                </IconButton>
            )
        }
    ];
    const handleActivateClick = async (rowData) => {
        console.log("check row id ", rowData.id)
        if (isDriver && routeWarehouse.routeStatusId === routeStatusMapReverse.IN_TRANSIT) {
            try {
                if (rowData.type === "transit-warehouse") {
                    const response = await request('put', `/route-warehouse-details/update-visited/${rowData.id}?visited=${!rowData.visited}`);
                    const updatedDropOffWarehouses = dropOffWarehouses.map(warehouse => {
                        if (warehouse.id === rowData.id) {
                            return { ...warehouse, visited: !warehouse.visited };
                        }
                        return warehouse;
                    });
                    setDropOffWarehouses(updatedDropOffWarehouses);
                    updateCombinedRequests(passengerRequests, updatedDropOffWarehouses);
                } else if (rowData.type === "passenger-request") {
                    const response = await request('put', `/passenger-requests/update-visited/${rowData.id}?visited=${!rowData.visited}`);
                    const updatedPassengerRequests = passengerRequests.map(request => {
                        if (request.requestId === rowData.id) {
                            return { ...request, visited: !request.visited };
                        }
                        return request;
                    });
                    setPassengerRequests(updatedPassengerRequests);
                    updateCombinedRequests(updatedPassengerRequests, dropOffWarehouses);
                }
            } catch (error) {
                setError(error);
            }
        }
    };


    const handleStatusChange = async (status) => {
        try {
            const response = await request('put', `/route-warehouses/${id}/status?statusId=${status}`);
            setRouteWarehouse(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchRouteWarehouse();
    }, [id]);

    useEffect(() => {
        if (routeWarehouse) {
            fetchDriver();
            fetchStartWarehouse();
            fetchDropOffWarehouses();
            fetchPassengerRequests();
        }
    }, [routeWarehouse]);

    useEffect(() => {
        console.log("check combinedRequests ", combinedRequests)
    }, [combinedRequests])

    const fetchRouteWarehouse = async () => {
        try {
            const response = await request('get', `/route-warehouses/${id}`);
            setRouteWarehouse(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const fetchStartWarehouse = async () => {
        try {
            const response = await request('get', `/warehouses/${routeWarehouse.startWarehouseId}`);
            setStartWarehouse(response.data);
        } catch (err) {
            setError(err);
        }
    }

    const fetchDriver = async () => {
        try {
            const response = await request('get', `/drivers/user/${routeWarehouse.driverId}`);
            setDriver(response.data);
        } catch (err) {
            setError(err);
        }
    }

    const fetchDropOffWarehouses = async () => {
        try {
            const response = await request('get', `/warehouses/by-warehouse-route/${id}`);
            setDropOffWarehouses(response.data);
            updateCombinedRequests(passengerRequests, response.data);
        } catch (err) {
            setError(err);
        }
    }

    const fetchPassengerRequests = async () => {
        try {
            const response = await request('get', `/passenger-requests/get-by-route-id/${id}`);
            setPassengerRequests(response.data);
            updateCombinedRequests(response.data, dropOffWarehouses);
        } catch (err) {
            setError(err);
        }
    }

    const updateCombinedRequests = (passengerRequests, dropOffWarehouses) => {
        setCombinedRequests(prevCombinedRequests => {
            const updatedCombinedRequests = [...prevCombinedRequests];

            // Update passenger requests
            passengerRequests.forEach(request => {
                const existingRequestIndex = updatedCombinedRequests.findIndex(
                    item => item.id === request.requestId && item.type === 'passenger-request'
                );

                if (existingRequestIndex > -1) {
                    updatedCombinedRequests[existingRequestIndex] = {
                        id: request.requestId,
                        type: 'passenger-request',
                        passengerName: request.passengerName,
                        pickupAddress: request.pickupAddress,
                        pickupLatitude: request.pickupLatitude,
                        pickupLongitude: request.pickupLongitude,
                        dropoffLatitude: request.dropoffLatitude,
                        dropoffLongitude: request.dropoffLongitude,
                        dropoffAddress: request.dropoffAddress,
                        visited: request.visited,
                        seqIndex: request.seqIndex
                    };
                } else {
                    updatedCombinedRequests.push({
                        id: request.requestId,
                        type: 'passenger-request',
                        passengerName: request.passengerName,
                        pickupAddress: request.pickupAddress,
                        pickupLatitude: request.pickupLatitude,
                        pickupLongitude: request.pickupLongitude,
                        dropoffLatitude: request.dropoffLatitude,
                        dropoffLongitude: request.dropoffLongitude,
                        dropoffAddress: request.dropoffAddress,
                        visited: request.visited,
                        seqIndex: request.seqIndex
                    });
                }
            });

            // Update drop-off warehouses
            dropOffWarehouses.forEach(warehouse => {
                const existingWarehouseIndex = updatedCombinedRequests.findIndex(
                    item => item.id === warehouse.id && item.type === 'transit-warehouse'
                );

                if (existingWarehouseIndex > -1) {
                    updatedCombinedRequests[existingWarehouseIndex] = {
                        id: warehouse.id,
                        type: 'transit-warehouse',
                        warehouseName: warehouse.warehouseName,
                        address: warehouse.address,
                        lat: warehouse.lat,
                        lon: warehouse.lon,
                        visited: warehouse.visited,
                        seqIndex: warehouse.seqIndex
                    };
                } else {
                    updatedCombinedRequests.push({
                        id: warehouse.id,
                        type: 'transit-warehouse',
                        warehouseName: warehouse.warehouseName,
                        address: warehouse.address,
                        lat: warehouse.lat,
                        lon: warehouse.lon,
                        visited: warehouse.visited,
                        seqIndex: warehouse.seqIndex
                    });
                }
            });

            // Sort combinedRequests by seqIndex
            updatedCombinedRequests.sort((a, b) => a.seqIndex - b.seqIndex);

            return updatedCombinedRequests;
        });
    };

    // const { isDriver } = props;
    // const [routeWarehouse, setRouteWarehouse] = useState(null);
    // const [driver, setDriver] = useState(null);
    // const [startWarehouse, setStartWarehouse] = useState(null);
    // const [dropOffWarehouses, setDropOffWarehouses] = useState([]);
    // const [passengerRequests, setPassengerRequests] = useState([]);
    // const [combinedRequests, setCombinedRequests] = useState([]);
    // const [loading, setLoading] = useState(true);
    // const [error, setError] = useState(null);
    // const match = useRouteMatch();
    // const { id } = match.params;
    // const history = useHistory();

    useEffect(() => {
        if (driver && routeWarehouse && combinedRequests.length > 0) {
            setLoading(false);
        }
    }, [combinedRequests, driver, routeWarehouse])

    if (loading) return <CircularProgress />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>Route {id} Details</h1>
                {routeWarehouse && (
                    <>
                        <Chip
                            label={routeStatusMap[routeWarehouse.routeStatusId]}
                            style={{
                                marginLeft: '20px',
                                backgroundColor: getStatusColor(routeWarehouse.routeStatusId),
                                color: 'white'
                            }}
                        />
                        {routeWarehouse.routeStatusId === routeStatusMapReverse.NotReady && !isDriver && <Chip
                            onClick={() => handleStatusChange(routeStatusMapReverse.Ready)}
                            label="Mark as Ready"
                            style={{
                                marginLeft: '20px',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                        />}
                        {routeWarehouse.routeStatusId === routeStatusMapReverse.Ready && isDriver && <Chip
                            onClick={() => handleStatusChange(routeStatusMapReverse.IN_TRANSIT)}
                            label="Start"
                            style={{
                                marginLeft: '20px',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                        />}
                        {routeWarehouse.routeStatusId === routeStatusMapReverse.IN_TRANSIT && isDriver && <Chip
                            onClick={() => handleStatusChange(routeStatusMapReverse.Complete)}
                            label="Mark as Complete"
                            style={{
                                marginLeft: '20px',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                        />}
                    </>

                )}
            </div>
            {!isDriver && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push(`/manage-routes/parcel-route-list/warehouse-route/${id}/add-request`)}
                    style={{ marginTop: '20px' }}
                >
                    Add Request To Pick Up Route
                </Button>
            )}
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <WarehouseRoute
                        style={{ width: "100%", height: "80vh" }}
                        driver={driver}
                        startWarehouse={startWarehouse}
                        combinedRequests={combinedRequests}
                    />
                </Grid>
                <Grid item xs={4}>
                    <StandardTable
                        columns={columnsCombined}
                        data={combinedRequests}
                        style={{
                            width: "100%",
                            height: "100%",
                            marginTop: "-40px",
                            marginBottom: "20px",
                            overflowY: "scroll",
                            overflowX: "hidden"
                        }}
                        options={{
                            selection: false,
                            pageSize: 5,
                            search: true,
                            sorting: true,
                        }}
                    />
                </Grid>
            </Grid>
            <br />
            {WarehouseRoute && (
                <div>
                    <TextField
                        label="Start warehouse id"
                        value={routeWarehouse.startWarehouseId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Driver ID"
                        value={routeWarehouse.driverId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Start Execute Time"
                        value={routeWarehouse.startExecuteStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="End Time"
                        value={routeWarehouse.endStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Route Status ID"
                        value={routeStatusMap[routeWarehouse.routeStatusId]}
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
