import React, { useState, useEffect } from "react";
import {
    Typography,
    Button,
    Grid,
    Container,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress
} from "@mui/material";
import { request } from "../../api"; // Cần chỉnh sửa đường dẫn đến thư mục api nếu cần
import { useHistory } from "react-router-dom";
import MultiLocationMap from "../../components/multi-location-map/MultiLocationMap";
import keycloak from "config/keycloak";
import { jwtDecode } from "jwt-decode";

const RegisterWareHouseDriver = () => {
    const [warehouses, setWarehouses] = useState();
    const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
    const [selectedWarehouse, setSelectedWarehouse] = useState();
    const [driverId, setDriverId] = useState();
    const history = useHistory();

    const fetchWarehouses = async () => {
        try {
            const response = await request("get", "/warehouses"); // Thay đổi đường dẫn endpoint nếu cần
            console.log("check response : ", response)
            if (response) {
                console.log("check response data: ", response.data)
                setWarehouses(response.data);
            }else{
                console.log("Error : ", response)
            }
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, [])

    useEffect(() => {
        console.log("check warehouse: ", warehouses);
    }, [warehouses])

    
    useEffect(() => {
        const token = keycloak.token;
        if (token) {
            const decodedToken = jwtDecode(token);
            const { preferred_username } = decodedToken;
            setDriverId(preferred_username)
        }
    }, []);


    const handleSelectWarehouse = (event) => {
        for (let index = 0; index < warehouses.length; index++) {
            if(warehouses[index].warehouseId === event.target.value){
                setSelectedWarehouse(warehouses[index]);
                console.log("check warehouse: ", warehouses[index]);
                break;
            }
        }
        setSelectedWarehouseId(event.target.value);
    };

    const handleRequestDriver = async () => {
        try {
            const response = await request("post", "/driver-warehouses", {
                warehouseId: selectedWarehouseId,
            }); // Thay đổi endpoint và dữ liệu body nếu cần
            console.log("Request sent successfully:", response.data);
            history.push("/for-driver/info"); // Redirect to driver info page
        } catch (error) {
            console.error("Error sending request:", error);
        }
    };

    if (!warehouses) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h3" align="center" gutterBottom>
                Register as Warehouse Driver
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id="warehouse-label">Select Warehouse</InputLabel>
                        <Select
                            labelId="warehouse-label"
                            id="warehouse"
                            value={selectedWarehouseId}
                            onChange={handleSelectWarehouse}
                            label="Select Warehouse"
                            required
                        >
                            {warehouses.map((warehouse) => (
                                <MenuItem key={warehouse.warehouseId} value={warehouse.warehouseId}>
                                    {warehouse.warehouseName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRequestDriver}
                        disabled={!selectedWarehouseId}
                    >
                        Request to Join as Driver
                    </Button>
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
                        <MultiLocationMap locations={warehouses} center={selectedWarehouse}/>
                    </div>
                </Grid>
            </Grid>
        </Container>
    );
};

export default RegisterWareHouseDriver;
