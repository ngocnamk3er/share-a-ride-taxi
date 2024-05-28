import React, { useState, useEffect, useRef } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { Typography, CircularProgress, Grid, IconButton, ButtonBase, Divider, Card, CardContent, Box } from "@mui/material";
import { useParams } from 'react-router-dom';
import { request } from "../../api";
import MultiLocationMap from "../../components/multi-location-map/MultiLocationMap";
import { StandardTable } from "erp-hust/lib/StandardTable";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import routeStatusMap from "config/statusMap";

const DetailWareHouse = () => {
    const [warehouse, setWarehouse] = useState(null);
    const [driverWarehouses, setDriverWarehouses] = useState([]);
    const [showTable, setShowTable] = useState(false); // State to control table visibility
    const [routePickups, setRoutePickups] = useState();
    const [routeWarehousesGoOut, setRouteWarehousesGoOut] = useState();
    const { id } = useParams(); // Lấy id từ URL
    const tableRef = useRef(null); // Create a ref for the table

    useEffect(() => {
        fetchWarehouse();
        fetchDriverWarehouses();
        fetchRoutePickups();
        fetchRouteWarehousesGoOut();
    }, []);

    useEffect(() => {
        if (routePickups && routeWarehousesGoOut) {
            console.log("routePickups and routeWarehouses :	", routePickups, routeWarehousesGoOut);
        }
    }, [routePickups, routeWarehousesGoOut])

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

    const fetchRoutePickups = async () => {
        try {
            const res = await request('get', `/route-pickups/warehouse/${id}`);
            setRoutePickups(res.data);
            console.log('Route Pickups:', res.data);
        } catch (error) {
            console.error('Error fetching route pickups:', error);
        }
    };

    const fetchRouteWarehousesGoOut = async () => {
        try {
            const res = await request('get', `/route-warehouses/start-warehouse/${id}`);
            setRouteWarehousesGoOut(res.data);
            console.log('Route Warehouses:', res.data);
        } catch (error) {
            console.error('Error fetching route warehouses:', error);
        }
    };

    const handleActivateClick = async (driverId, warehouseId) => {
        try {
            const res = await request("post", `/driver-warehouses/${driverId}/${warehouseId}/activate`);
            // Update the driverWarehouses state to reflect the change
            setDriverWarehouses(prevDriverWarehouses =>
                prevDriverWarehouses.map(dw =>
                    dw.driverId === driverId && dw.warehouseId === warehouseId ? res.data : dw
                )
            );
        } catch (error) {
            console.error("Error activating driver warehouse:", error);
        }
    };

    const toggleTableVisibility = () => {
        setShowTable(prev => !prev);
        if (!showTable) {
            setTimeout(() => {
                tableRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100); // Delay to ensure state has updated
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

    const pickUpRouteColumns = [
        {
            title: "Route ID",
            field: "id"
        },
        {
            title: "Status",
            field: "routeStatusId",
            render: (rowData) => routeStatusMap[rowData.routeStatusId]
        },
    ];

    const pickUpRouteWarehouseGoOutColumns = [
        {
            title: "Route ID",
            field: "id"
        },
        {
            title: "Status",
            field: "routeStatusId",
            render: (rowData) => routeStatusMap[rowData.routeStatusId]
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
                                onClick={toggleTableVisibility}
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
                                <ExpandMoreIcon style={{ transform: showTable ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }} />
                            </ButtonBase>
                            {showTable && (
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
            </Grid>
        </Grid>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailWareHouse, SCR_ID, true);
