import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField, Button, Grid, CircularProgress, Chip, IconButton } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { request } from "../../api";
import { StandardTable } from "erp-hust/lib/StandardTable";
import PickUpRoute from "components/route/pickup-route/PickUpRoute";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { routeStatusMap, getStatusColor, routeStatusMapReverse } from "config/statusMap";

const DetailPickUpParcelRoute = (props) => {
    const { isDriver } = props;

    const [routePickup, setRoutePickup] = useState(null);
    const [driver, setDriver] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [pickUpParcelRequests, setPickUpParcelRequests] = useState(null);
    const [passengerRequests, setPassengerRequests] = useState(null);
    const [combinedRequests, setCombinedRequests] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const match = useRouteMatch();
    const history = useHistory();
    const { id } = match.params;

    const columnsRequest = [
        {
            title: "Sender Name",
            field: "senderName",
            render: (rowData) => {
                let displayText = '';
                if (rowData.type === 'parcel-request') {
                    displayText = `parcel-request of ${rowData.senderName}`;
                } else if (rowData.type === 'passenger-request') {
                    displayText = `passenger-request of ${rowData.passengerName}`;
                }
                return (
                    <span
                        style={{ cursor: 'pointer' }}
                        onClick={(event) => handleRowClick(event, rowData)}
                    >
                        {displayText}
                    </span>
                );
            },
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
                        handleViewClick(rowData);
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
        if (isDriver && routePickup.routeStatusId === routeStatusMapReverse.IN_TRANSIT) {
            const params = new URLSearchParams({
                routeId: routePickup.id,
                requestId: rowData.requestId,
                visited: !rowData.visited
            });

            try {
                const response = await request('put', `/route-pickup-details/visited?${params.toString()}`);

                // Cập nhật trạng thái visited của request trong danh sách combinedRequests
                setCombinedRequests((prevRequests) =>
                    prevRequests.map((request) =>
                        request.requestId === rowData.requestId && request.routeId === rowData.routeId
                            ? { ...request, visited: !request.visited }
                            : request
                    )
                );

                console.log("Updated visited status for:", rowData.type);
            } catch (error) {
                console.error("Error updating visited status:", error);
            }
        }
    };


    const handleRowClick = (event, rowData) => {
        const center = [rowData.pickupLatitude, rowData.pickupLongitude];
        setCenter(center);
    };

    const handleViewClick = (rowData) => {
        console.log("View clicked for:", rowData);
    };

    const handleStatusChange = async (status) => {
        const newStatus = status;
        setSelectedStatus(newStatus);

        try {
            await request('put', `/route-pickups/${id}/status?status=${newStatus}`);
            setRoutePickup(prevState => ({ ...prevState, routeStatusId: parseInt(newStatus) }));
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        const fetchRoutePickup = async () => {
            try {
                const response = await request('get', `/route-pickups/${id}`);
                setRoutePickup(response.data);
                setSelectedStatus(response.data.routeStatusId);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchPickUpRouteRequests = async () => {
            try {
                const resParcelReq = await request('get', `/parcel-requests/by-pickup-route/${id}`);
                const pickUpParcelRequests = resParcelReq.data;
                setPickUpParcelRequests(pickUpParcelRequests);

                const resPassengerReq = await request("get", `/passenger-requests/get-by-route-id/${id}`);
                const passengerRequests = resPassengerReq.data;
                setPassengerRequests(passengerRequests);

                const combinedRequests = [
                    ...pickUpParcelRequests.map(request => ({
                        ...request,
                        type: 'parcel-request',
                    })),
                    ...passengerRequests.map(request => ({
                        ...request,
                        type: 'passenger-request',
                    })),
                ];

                combinedRequests.sort((a, b) => a.seqIndex - b.seqIndex);

                setCombinedRequests(combinedRequests);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoutePickup();
        fetchPickUpRouteRequests();
    }, [id]);

    useEffect(() => {
        console.log("check route pick up request:", routePickup);

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

        if (routePickup) {
            fetchDriver(routePickup.driverId);
            fetchWarehouse(routePickup.wareHouseId);
        }
    }, [routePickup]);

    useEffect(() => {
        console.log("check driver and warehouse:", driver, warehouse);
    }, [driver, warehouse]);

    useEffect(() => {
        console.log("check combinedRequests:", JSON.stringify(combinedRequests));
    }, [combinedRequests]);

    if (loading) return <CircularProgress />;
    if (!(combinedRequests && driver && warehouse && pickUpParcelRequests)) return <CircularProgress />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>Route {id} Details</h1>
                {routePickup && (
                    <>
                        <Chip
                            label={routeStatusMap[routePickup.routeStatusId]}
                            style={{
                                marginLeft: '20px',
                                backgroundColor: getStatusColor(routePickup.routeStatusId),
                                color: 'white'
                            }}
                        />
                        {routePickup.routeStatusId === routeStatusMapReverse.NotReady && !isDriver && <Chip
                            onClick={() => handleStatusChange(routeStatusMapReverse.Ready)}
                            label="Mark as Ready"
                            style={{
                                marginLeft: '20px',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                        />}
                        {routePickup.routeStatusId === routeStatusMapReverse.Ready && isDriver && <Chip
                            onClick={() => handleStatusChange(routeStatusMapReverse.IN_TRANSIT)}
                            label="Start"
                            style={{
                                marginLeft: '20px',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                        />}
                        {routePickup.routeStatusId === 2 && isDriver && <Chip
                            onClick={() => handleStatusChange(3)}
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
                    onClick={() => history.push(`/manage-routes/parcel-route-list/pick-up-route/${id}/add-request`)}
                    style={{ marginTop: '20px' }}
                >
                    Add Request To Pick Up Route
                </Button>
            )}
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <PickUpRoute
                        style={{ width: "100%", height: "100%" }}
                        listLocation={pickUpParcelRequests.map(req => ({
                            lat: req.pickupLatitude,
                            lon: req.pickupLongitude,
                            address: req.pickupAddress
                        }))}
                        combinedRequests={combinedRequests}
                        driver={driver}
                        warehouse={warehouse}
                        center={center}
                        isDriver={isDriver}
                    />
                </Grid>
                <Grid item xs={4}>
                    <StandardTable
                        columns={columnsRequest}
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
