import React, { useState, useEffect, useRef } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { Typography, CircularProgress, Grid, IconButton, ButtonBase, Divider, Card, CardContent, Box, Chip } from "@mui/material";
import { useParams } from 'react-router-dom';
import { request } from "../../api";
import MultiLocationMap from "../../components/multi-location-map/MultiLocationMap";
import { StandardTable } from "erp-hust/lib/StandardTable";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { routeStatusMap } from "config/statusMap";
import { getStatusColor } from "config/statusMap";
import { routeStatusMapReverse } from "config/statusMap";

const DetailWareHouse = () => {
    const [warehouse, setWarehouse] = useState(null);
    const [driverWarehouses, setDriverWarehouses] = useState([]);
    const [showDriverTable, setShowDriverTable] = useState(false);
    const [routePickups, setRoutePickups] = useState([]);
    const [showPickupTable, setShowPickupTable] = useState(false);
    const [routeWarehousesGoOut, setRouteWarehousesGoOut] = useState([]);
    const [showWarehouseGoOutTable, setShowWarehouseGoOutTable] = useState(false);
    const [routeWarehousesComeIn, setRouteWarehousesComeIn] = useState([]);
    const [showWarehouseComeInTable, setShowWarehouseComeInTable] = useState(false);
    const [routeDropOff, setRouteDropOff] = useState([]);
    const [showRouteDropOffable, setShowRouteDropOffable] = useState(false);
    const { id } = useParams();
    const tableRef = useRef(null);

    useEffect(() => {
        fetchWarehouse();
        fetchDriverWarehouses();
        fetchRoutePickups();
        fetchRouteDropOff();
        fetchRouteWarehousesGoOut();
        fetchRouteWarehousesComeIn();
    }, []);

    useEffect(() => {
        if (routeWarehousesComeIn.length) {
            console.log("Route Pickups and Route Warehouses and Route Warehouse Come In:", routeWarehousesComeIn);
        }
    }, [routeWarehousesComeIn]);

    const fetchWarehouse = async () => {
        try {
            const res = await request("get", `/warehouses/${id}`);
            setWarehouse(res.data);
        } catch (error) {
            console.error("Error fetching warehouse:", error);
        }
    };

    const fetchDriverWarehouses = async () => {
        try {
            const res = await request("get", `/driver-warehouses/warehouse/${id}`);
            setDriverWarehouses(res.data);
        } catch (error) {
            console.error("Error fetching driver warehouses:", error);
        }
    };

    const fetchRouteDropOff = async () => {
        try {
            const res = await request('get', `/route-dropoffs/warehouse/${id}`);
            setRouteDropOff(res.data);
        } catch (error) {
            console.error('Error fetching route pickups:', error);
        }
    };

    const fetchRoutePickups = async () => {
        try {
            const res = await request('get', `/route-pickups/warehouse/${id}`);
            setRoutePickups(res.data);
        } catch (error) {
            console.error('Error fetching route pickups:', error);
        }
    };

    const fetchRouteWarehousesGoOut = async () => {
        try {
            const res = await request('get', `/route-warehouses/start-warehouse/${id}`);
            setRouteWarehousesGoOut(res.data);
        } catch (error) {
            console.error('Error fetching route warehouses:', error);
        }
    };

    const fetchRouteWarehousesComeIn = async () => {
        try {
            const res = await request('get', `/route-warehouse-details/route-come-in/${id}`);
            setRouteWarehousesComeIn(res.data);
        } catch (error) {
            console.error('Error fetching route warehouses:', error);
        }
    };

    const handleActivateClick = async (driverId, warehouseId) => {
        try {
            const res = await request("post", `/driver-warehouses/${driverId}/${warehouseId}/activate`);
            setDriverWarehouses(prevDriverWarehouses =>
                prevDriverWarehouses.map(dw =>
                    dw.driverId === driverId && dw.warehouseId === warehouseId ? res.data : dw
                )
            );
        } catch (error) {
            console.error("Error activating driver warehouse:", error);
        }
    };

    const toggleTableVisibility = (tableSetter, currentVisibility) => {
        tableSetter(!currentVisibility);
        if (!currentVisibility) {
            setTimeout(() => {
                tableRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handlePickupStatusChange = async (routePickup) => {
        try {
            const params = new URLSearchParams({
                routeId: routePickup.id,
                requestId: routePickup.requestId,
                visited: !routePickup.visited
            });
            await request('put', `/route-pickups/${routePickup.id}/status?status=${routeStatusMapReverse.Ready}`);
            setRoutePickups(prevState => prevState.map(item => item.id === routePickup.id ? { ...item, routeStatusId: routeStatusMapReverse.Ready } : item));
        } catch (error) {
            console.error("Error changing pickup route status:", error);
        }
    };

    const handleDropOffStatusChange = async (routeDropOff) => {
        try {
            const params = new URLSearchParams({
                routeId: routeDropOff.id,
                requestId: routeDropOff.requestId,
                visited: !routeDropOff.visited
            });
            await request('put', `/route-dropoffs/${routeDropOff.id}/status?status=${routeStatusMapReverse.Ready}`);
            setRouteDropOff(prevState => prevState.map(item => item.id === routeDropOff.id ? { ...item, routeStatusId: routeStatusMapReverse.Ready } : item));
        } catch (error) {
            console.error("Error changing drop off route status:", error);
        }
    };

    const handleWarehouseStatusChange = async (routeId, status) => {
        try {
            await request('put', `/route-warehouses/${routeId}/status?statusId=${routeStatusMapReverse.Ready}`);
            setRouteWarehousesGoOut(prevState => prevState.map(item => item.id === routeId ? { ...item, routeStatusId: routeStatusMapReverse.Ready } : item));
        } catch (error) {
            console.error("Error changing warehouse route status:", error);
        }
    };

    const driverColumns = [
        { title: "Driver ID", field: "driverId" },
        {
            title: "Joining Date",
            field: "joiningDate",
            render: rowData => new Date(rowData.joiningDate).toLocaleString()
        },
        {
            title: "Active",
            field: "active",
            render: rowData => rowData.active ? "Yes" : "No"
        },
        {
            title: "Actions",
            field: "actions",
            render: rowData => (
                <IconButton
                    onClick={() => handleActivateClick(rowData.driverId, rowData.warehouseId)}
                    disabled={rowData.active}
                    color="primary"
                >
                    <CheckCircleIcon />
                </IconButton>
            )
        }
    ];
    const pickupRouteColumns = [
        {
            title: "Route ID",
            field: "id"
        },
        {
            title: "Status",
            field: "routeStatusId",
            render: (rowData) => (
                <>
                    <Chip
                        label={routeStatusMap[rowData.routeStatusId]}
                        style={{
                            backgroundColor: getStatusColor(rowData.routeStatusId),
                            color: 'white',
                            marginRight: '8px'
                        }}
                    />
                    {rowData.routeStatusId === 0 &&
                        <Chip
                            onClick={() => handlePickupStatusChange(rowData)}
                            label="Mark As Ready"
                            style={{
                                backgroundColor: 'green',
                                color: 'white',
                                marginRight: '8px'
                            }}
                        />
                    }
                </>
            )
        },
    ];

    const dropOffRouteColumns = [
        {
            title: "Route ID",
            field: "id"
        },
        {
            title: "Status",
            field: "routeStatusId",
            render: (rowData) => (
                <>
                    <Chip
                        label={routeStatusMap[rowData.routeStatusId]}
                        style={{
                            backgroundColor: getStatusColor(rowData.routeStatusId),
                            color: 'white',
                            marginRight: '8px'
                        }}
                    />
                    {rowData.routeStatusId === 0 &&
                        <Chip
                            onClick={() => handleDropOffStatusChange(rowData)}
                            label="Mark As Ready"
                            style={{
                                backgroundColor: 'green',
                                color: 'white',
                                marginRight: '8px'
                            }}
                        />
                    }
                </>
            )
        },
    ];

    const warehouseRouteColumns = [
        {
            title: "Route ID",
            field: "id"
        },
        {
            title: "Status",
            field: "routeStatusId",
            render: (rowData) => (
                <>
                    <Chip
                        label={routeStatusMap[rowData.routeStatusId]}
                        style={{
                            backgroundColor: getStatusColor(rowData.routeStatusId),
                            color: 'white',
                            marginRight: '8px'
                        }}
                    />
                    {rowData.routeStatusId === 0 &&
                        <Chip
                            onClick={() => handleWarehouseStatusChange(rowData.id, 1)}
                            label="Mark As Ready"
                            style={{
                                backgroundColor: 'green',
                                color: 'white',
                                marginRight: '8px'
                            }}
                        />
                    }
                </>
            )
        },
    ];


    const warehouseRouteComeInColumns = [
        {
            title: "Route ID",
            field: "routeId"
        },
        {
            title: "Visited",
            field: "visited",
            render: rowData => (
                <IconButton
                    color={rowData.visited ? 'primary' : 'text.disabled'}
                >
                    <CheckCircleIcon />
                </IconButton>
            )
        },
    ];

    if (!warehouse) {
        return <CircularProgress />;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4" gutterBottom>
                    Warehouse Detail
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Warehouse Information
                        </Typography>
                        <Box mb={2}>
                            <Typography>
                                <strong>Warehouse ID: </strong> {warehouse.warehouseId}
                            </Typography>
                            <Typography>
                                <strong>Warehouse name: </strong> {warehouse.warehouseName}
                            </Typography>
                            <Typography>
                                <strong>Address: </strong> {warehouse.address}
                            </Typography>
                            <Typography>
                                <strong>Address note: </strong> {warehouse.addressNote}
                            </Typography>
                            <Typography>
                                <strong>Created by: </strong> {warehouse.createdByUserId}
                            </Typography>
                        </Box>
                        <Divider />
                        <Box mt={2} mb={2}>
                            <div
                                style={{
                                    inset: 0,
                                    margin: "auto",
                                    width: "100%",
                                    height: "60vh",
                                    backgroundColor: "#fff",
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                    padding: "20px",
                                    display: "flex"
                                }}>
                                <MultiLocationMap locations={[warehouse]} />
                            </div>
                        </Box>
                        <Divider />
                        <Box mt={2} ref={tableRef}>
                            <ButtonBase
                                onClick={() => toggleTableVisibility(setShowDriverTable, showDriverTable)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    textAlign: "left",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #ddd"
                                }}
                            >
                                <Typography variant="h6" color="primary">
                                    Drivers Associated with this Warehouse
                                </Typography>
                                <ExpandMoreIcon style={{ transform: showDriverTable ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                            </ButtonBase>
                            {showDriverTable && (
                                <StandardTable
                                    title="Drivers List"
                                    columns={driverColumns}
                                    data={driverWarehouses}
                                    options={{
                                        selection: false,
                                        pageSize: 5,
                                        search: true,
                                        sorting: true,
                                    }}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>
                <br />
                <Card>
                    <CardContent>
                        <Box mt={2} ref={tableRef}>
                            <ButtonBase
                                onClick={() => toggleTableVisibility(setShowPickupTable, showPickupTable)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    textAlign: "left",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #ddd"
                                }}
                            >
                                <Typography variant="h6" color="primary">
                                    Pickup Routes
                                </Typography>
                                <ExpandMoreIcon style={{ transform: showPickupTable ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                            </ButtonBase>
                            {showPickupTable && (
                                <StandardTable
                                    title="Pickup Routes"
                                    columns={pickupRouteColumns}
                                    data={routePickups}
                                    options={{
                                        selection: false,
                                        pageSize: 5,
                                        search: true,
                                        sorting: true,
                                    }}
                                />
                            )}
                        </Box>
                        <Box mt={2} ref={tableRef}>
                            <ButtonBase
                                onClick={() => toggleTableVisibility(setShowWarehouseGoOutTable, showWarehouseGoOutTable)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    textAlign: "left",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #ddd"
                                }}
                            >
                                <Typography variant="h6" color="primary">
                                    Warehouse Routes Go Out
                                </Typography>
                                <ExpandMoreIcon style={{ transform: showWarehouseGoOutTable ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                            </ButtonBase>
                            {showWarehouseGoOutTable && (
                                <StandardTable
                                    title="Route Warehouses Go Out"
                                    columns={warehouseRouteColumns}
                                    data={routeWarehousesGoOut}
                                    options={{
                                        selection: false,
                                        pageSize: 5,
                                        search: true,
                                        sorting: true,
                                    }}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>
                <br />
                <Card>
                    <CardContent>
                        <Box mt={2} ref={tableRef}>
                            <ButtonBase
                                onClick={() => toggleTableVisibility(setShowWarehouseComeInTable, showWarehouseComeInTable)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    textAlign: "left",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #ddd"
                                }}
                            >
                                <Typography variant="h6" color="primary">
                                    Warehouse Routes Come In
                                </Typography>
                                <ExpandMoreIcon style={{ transform: showWarehouseComeInTable ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                            </ButtonBase>
                            {showWarehouseComeInTable && (
                                <StandardTable
                                    title="Warehouse Routes Come In"
                                    columns={warehouseRouteComeInColumns}
                                    data={routeWarehousesComeIn}
                                    options={{
                                        selection: false,
                                        pageSize: 5,
                                        search: true,
                                        sorting: true,
                                    }}
                                />
                            )}
                        </Box>
                        <Box mt={2} ref={tableRef}>
                            <ButtonBase
                                onClick={() => toggleTableVisibility(setShowRouteDropOffable, showRouteDropOffable)}
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    textAlign: "left",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #ddd"
                                }}
                            >
                                <Typography variant="h6" color="primary">
                                    Drop Off Routes
                                </Typography>
                                <ExpandMoreIcon style={{ transform: showRouteDropOffable ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                            </ButtonBase>
                            {showRouteDropOffable && (
                                <StandardTable
                                    title="Drop Off Routes"
                                    columns={dropOffRouteColumns}
                                    data={routeDropOff}
                                    options={{
                                        selection: false,
                                        pageSize: 5,
                                        search: true,
                                        sorting: true,
                                    }}
                                />
                            )}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailWareHouse, SCR_ID, true);
