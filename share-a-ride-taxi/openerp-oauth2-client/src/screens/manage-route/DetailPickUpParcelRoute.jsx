import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField, Button } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { request } from "../../api";
import { CircularProgress } from "@mui/material";
import { StandardTable } from "erp-hust/lib/StandardTable";
import PickUpRoute from "components/route/pickup-route/PickUpRoute";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';


const DetailPickUpParcelRoute = () => {
    const [routePickup, setRoutePickup] = useState(null);
    const [driver, setDriver] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [routePickupDetailList, setRoutePickupDetailList] = useState(null);
    const [pickUpRequests, setPickUpRequests] = useState(null);
    const [reqLocations, setReqLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState(null);
    const match = useRouteMatch();
    const history = useHistory();
    const { id } = match.params;

    const statusLookup = {
        0: "None",
        1: "Received",
        2: "Driver Assigned",
        3: "In Transit",
        4: "Delivered",
        5: "Cancelled"
    };

    const columnsRequest = [
        {
            title: "Sender Name",
            field: "senderName",
        },
        {
            title: "Recipient Name",
            field: "recipientName",
        },
        {
            title: "Pickup Location Address",
            field: "pickupAddress",
        },
        {
            title: "Status",
            field: "statusId",
            render: (rowData) => statusLookup[rowData.statusId] // Render status label using lookup
        },
        // {
        //     title: "Visited",
        //     render: (rowData) => routePickupDetailList.find((element) => {
        //         return rowData.id === element.request_id;
        //     }).visited // Render status label using lookup
        // }
        // {
        //     title: "View",
        //     sorting: false,
        //     render: (rowData) => (
        //         <IconButton
        //             onClick={() => {
        //                 handleViewClick(rowData);
        //             }}
        //             variant="contained"
        //             color="primary"
        //         >
        //             <VisibilityIcon />
        //         </IconButton>
        //     ),
        // },
    ]

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

    const handleRowClick = (event, rowData) => {
        const center = [rowData.pickupLatitude, rowData.pickupLongitude]
        setCenter(center);
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
        if (routePickup) {
            fetchDriver(routePickup.driverId);
            fetchWarehouse(routePickup.wareHouseId);
        }
    }, [routePickup])

    useEffect(() => {
        if (driver && warehouse) {
            console.log("check driver : ", driver)
            console.log("check warehouse : ", warehouse)
        }

    }, [driver, warehouse])

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


    if (loading) return <CircularProgress />;
    if (!(reqLocations && driver && warehouse)) return <CircularProgress />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <h1>Route {id} Details</h1>
            <PickUpRoute style={{ width: "100%", height: "80vh" }}
                listLocation={reqLocations}
                driver={driver}
                warehouse={warehouse}
                center={center}
            />
            <br />
            <StandardTable
                columns={columnsRequest}
                data={pickUpRequests}
                options={{
                    selection: false,
                    pageSize: 5,
                    search: true,
                    sorting: true,
                }}
                onRowClick={handleRowClick}
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
