import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { request } from "../../api";
import { CircularProgress } from "@mui/material";
import { Button } from "@mui/material";
import { Grid } from "@mui/material";
import { StandardTable } from "erp-hust/lib/StandardTable";
import DropOffRoute from "components/route/dropoff-route/DropOffRoute";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { routeStatusMap } from "config/statusMap";

const DetailDropOffParcelRoute = () => {
    const [routeDropOff, setRouteDropOff] = useState(null);
    const [driver, setDriver] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [dropOffParcelRequests, setDropOffParcelRequests] = useState(null);
    const [passengerRequests, setPassengerRequests] = useState(null);
    const [combinedRequests, setCombinedRequests] = useState(null);
    const [reqLocations, setReqLocations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState(null);
    const match = useRouteMatch();
    const history = useHistory();
    const { id } = match.params;
    const columnsRequest = [
        {
            title: "Sender Name",
            field: "senderName",
            render: (rowData) => {
                if (rowData.type === 'parcel-request') {
                    return `parcel-request of ${rowData.senderName}`;
                } else if (rowData.type === 'passenger-request') {
                    return `passenger-request of ${rowData.passengerName}`;
                }
                return '';
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
                    // onClick={() => handleActivateClick(rowData.driverId, rowData.warehouseId)}
                    disabled={!rowData.visited}
                    color="primary"
                >
                    <CheckCircleIcon />
                </IconButton>
            )
        }
    ];




    useEffect(() => {
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
                const resParcelReq = await request('get', `/parcel-requests/by-drop-off-route/${id}`);
                const dropOffParcelRequests = resParcelReq.data;
                setDropOffParcelRequests(dropOffParcelRequests)

                const resPassengerReq = await request("get", `/passenger-requests/get-by-route-id/${id}`);
                const passengerRequests = resPassengerReq.data;
                setPassengerRequests(passengerRequests)

                // Kết hợp cả hai loại yêu cầu
                const combinedRequests = [
                    ...dropOffParcelRequests.map(request => ({
                        ...request,
                        type: 'parcel-request',
                    })),
                    ...passengerRequests.map(request => ({
                        ...request,
                        type: 'passenger-request',
                    })),
                ];

                // Sắp xếp theo seqIndex
                combinedRequests.sort((a, b) => a.seqIndex - b.seqIndex);

                setCombinedRequests(combinedRequests);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRouteDropOff();
        fetchDropOffRouteRequests();
    }, [id]);

    useEffect(() => {
        console.log("check reqLocations : ", reqLocations)
    }, [reqLocations]);

    useEffect(() => {
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
        console.log("check dropOffRequests : ", dropOffParcelRequests)
        if (dropOffParcelRequests != null) {
            setReqLocations(dropOffParcelRequests.map((req) => {
                return {
                    lat: req.dropoffLatitude,
                    lon: req.dropoffLongitude,
                    address: req.dropoffAddress
                };
            }))
        }
    }, [dropOffParcelRequests]);

    const handleViewClick = (rowData) => {
        // Xử lý khi click vào View
        console.log("View clicked for:", rowData);
    };

    const handleRowClick = (event, rowData) => {
        const center = [rowData.pickupLatitude, rowData.pickupLongitude]
        setCenter(center);
    };

    useEffect(() => {
        if (reqLocations && driver && warehouse) {
            console.log("okok")
        }
    }, [reqLocations, driver, warehouse])

    if (loading) return <CircularProgress />;
    if (!(combinedRequests && driver && warehouse && dropOffParcelRequests)) return <CircularProgress />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <h1>Route {id} Details</h1>
            <Button
                variant="contained"
                color="primary"
                onClick={() => history.push(`/manage-routes/parcel-route-list/drop-off-route/${id}/add-request`)}
                style={{ marginTop: '20px' }}
            >
                Add Request To Drop Off Route
            </Button>
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <DropOffRoute style={{ width: "100%", height: "100%" }}
                        listLocation={reqLocations}
                        driver={driver}
                        warehouse={warehouse}
                        center={center}
                        combinedRequests={combinedRequests}
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
                        onRowClick={handleRowClick}
                    />
                </Grid>
            </Grid>
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
