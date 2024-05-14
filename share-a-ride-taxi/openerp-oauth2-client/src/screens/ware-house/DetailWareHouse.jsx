import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { Typography, CircularProgress, Grid } from "@mui/material";
import { useParams } from 'react-router-dom';
import { request } from "../../api";
import MultiLocationMap from "../../components/multi-location-map/MultiLocationMap"; // Đảm bảo đường dẫn đến component MultiLocationMap là chính xác
import { Height, WidthFull } from "@mui/icons-material";


const DetailWareHouse = () => {
    const [warehouse, setWarehouse] = useState(null);
    const { id } = useParams(); // Lấy id từ URL

    useEffect(() => {
        fetchWarehouse();
    }, []);

    const fetchWarehouse = async () => {
        try {
            const res = await request("get", `/warehouses/${id}`);
            setWarehouse(res.data);
        } catch (error) {
            console.error("Error fetching warehouse:", error);
        }
    };

    if (!warehouse) {
        return <CircularProgress />;
    }

    return (
        // <div>
        //     <h1>Warehouse Detail</h1>
        //     {warehouse ? (
        //         <div>
        //             <p><strong>Warehouse ID:</strong> {warehouse.warehouseId}</p>
        //             <p><strong>Warehouse Name:</strong> {warehouse.warehouseName}</p>
        //             <p><strong>Address:</strong> {warehouse.address}</p>
        //             <p><strong>Address Note:</strong> {warehouse.addressNote}</p>
        //             <p><strong>Latitude:</strong> {warehouse.lat}</p>
        //             <p><strong>Longitude:</strong> {warehouse.lon}</p>
        //             <p><strong>Created At:</strong> {warehouse.createdAt}</p>
        //             <p><strong>Updated At:</strong> {warehouse.updatedAt}</p>
        //             <p><strong>Created By User ID:</strong> {warehouse.createdByUserId}</p>
        //         </div>
        //     ) : (
        //         <p>Loading...</p>
        //     )}
        // </div>
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
                    <strong>Address note : </strong> {warehouse.addressNote}
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
        </Grid>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailWareHouse, SCR_ID, true);
