import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import SearchLocation from '../../components/searchLocation/SearchLocation';
import { useHistory } from "react-router-dom";
import keycloak from "config/keycloak";
import { jwtDecode } from "jwt-decode";
import { request } from "../../api";

const CreateWarehouse = () => {
    const [warehouseInfo, setWarehouseInfo] = useState({
        warehouseId: "",
        warehouseName: "",
        address: "",
        addressNote: "",
        lat: "",
        lon: "",
        createdByUserId: ""
    });

    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWarehouseInfo({ ...warehouseInfo, [name]: value });
    };

    const handleSetPosition = (position) => {
        setWarehouseInfo(prevWareHouseInfo => ({
            ...prevWareHouseInfo,
            lat: position.lat,
            lon: position.lon,
            address: position.display_name
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(warehouseInfo)
        try {
            await request("post", "/warehouses", (res) => {
                console.log("Request created successfully:", res.data);
                history.push("/warehouse/list");
            }, null, warehouseInfo);
        } catch (error) {
            console.error("Error creating warehouse:", error);
        }
    };

    useEffect(() => {
        const token = keycloak.token;
        if (token) {
            const decodedToken = jwtDecode(token);
            const { preferred_username } = decodedToken;
            const createdByUserId = preferred_username;
            setWarehouseInfo(prevState => ({
                ...prevState,
                createdByUserId,
            }));
        }
    }, []);

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Create New Warehouse
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            name="createdByUserId"
                            label="Created By User ID"
                            value={warehouseInfo.createdByUserId}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="warehouseId"
                            label="Warehouse ID"
                            value={warehouseInfo.warehouseId}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            name="warehouseName"
                            label="Warehouse Name"
                            value={warehouseInfo.warehouseName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="address"
                            label="Address"
                            value={warehouseInfo.address}
                            onClick={() => setShowModal(true)}
                            fullWidth
                            required
                            InputProps={{ readOnly: true }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Modal
                            open={showModal}
                            onClose={() => setShowModal(false)}
                            aria-labelledby="address-modal"
                            aria-describedby="address"
                        >
                            <div>
                                <SearchLocation
                                    centerPos={warehouseInfo.lat ? [warehouseInfo.lat, warehouseInfo.lon] : null}
                                    setPosition={(position) => handleSetPosition(position)}
                                    onClose={() => {
                                        setShowModal(false)
                                    }}
                                />
                            </div>
                        </Modal>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="addressNote"
                            label="Address Note"
                            value={warehouseInfo.addressNote}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">
                            Create
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
};

export default CreateWarehouse;
