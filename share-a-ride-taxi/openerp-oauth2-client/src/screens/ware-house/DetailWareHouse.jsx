import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { Typography, CircularProgress, Grid, IconButton } from "@mui/material";
import { useParams } from 'react-router-dom';
import { request } from "../../api";
import MultiLocationMap from "../../components/multi-location-map/MultiLocationMap";
import { StandardTable } from "erp-hust/lib/StandardTable";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const DetailWareHouse = () => {
    const [warehouse, setWarehouse] = useState(null);
    const [driverWarehouses, setDriverWarehouses] = useState([]);
    const { id } = useParams(); // Lấy id từ URL

    useEffect(() => {
        fetchWarehouse();
        fetchDriverWarehouses();
    }, []);

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

    const columns = [
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
                <Typography>
                    <strong>Warehouse ID: </strong> {warehouse.warehouseId}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Warehouse name: </strong> {warehouse.warehouseName}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Address: </strong> {warehouse.address}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Address note: </strong> {warehouse.addressNote}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Created by: </strong> {warehouse.createdByUserId}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <div
                    style={{
                        inset: 0,
                        margin: "auto",
                        width: "100%",
                        height: "80vh",
                        backgroundColor: "#fff",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        padding: "20px",
                        display: "flex"
                    }}>
                    <MultiLocationMap locations={[warehouse]} />
                </div>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                    Drivers Associated with this Warehouse
                </Typography>
                <StandardTable
                    title="Drivers List"
                    columns={columns}
                    data={driverWarehouses}
                    options={{
                        selection: false,
                        pageSize: 5,
                        search: true,
                        sorting: true,
                    }}
                />
            </Grid>
        </Grid>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailWareHouse, SCR_ID, true);
