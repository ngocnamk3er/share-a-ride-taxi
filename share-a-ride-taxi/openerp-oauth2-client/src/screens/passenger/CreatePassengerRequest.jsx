import React, { useState } from "react";
import { Typography, CircularProgress, Grid, TextField, Button } from "@mui/material";
import Map from "../../components/Map";
import { request } from "../../api";
import withScreenSecurity from 'components/common/withScreenSecurity';

const CreatePassengerRequest = () => {
    const [passengerData, setPassengerData] = useState({
        passengerName: "",
        phoneNumber: "",
        email: "",
        pickupLocationLatitude: "",
        pickupLocationLongitude: "",
        pickupLocationAddress: "",
        dropoffLocationLatitude: "",
        dropoffLocationLongitude: "",
        dropoffLocationAddress: "",
        requestTime: "",
        statusId: 1 // Default status ID
    });

    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPassengerData({ ...passengerData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await request("post", "http://localhost:8080/api/passenger-requests", passengerData);
            console.log("Passenger request created successfully:", response.data);
            // Clear form after successful submission
            setPassengerData({
                passengerName: "",
                phoneNumber: "",
                email: "",
                pickupLocationLatitude: "",
                pickupLocationLongitude: "",
                pickupLocationAddress: "",
                dropoffLocationLatitude: "",
                dropoffLocationLongitude: "",
                dropoffLocationAddress: "",
                requestTime: "",
                statusId: 1
            });
        } catch (error) {
            console.error("Error creating passenger request:", error);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Create Passenger Request</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="passengerName"
                    label="Passenger Name"
                    value={passengerData.passengerName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="phoneNumber"
                    label="Phone Number"
                    value={passengerData.phoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="email"
                    label="Email"
                    value={passengerData.email}
                    onChange={handleInputChange}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                <Map
                    lat={passengerData.pickupLocationLatitude || ""}
                    lng={passengerData.pickupLocationLongitude || ""}
                    address={passengerData.pickupLocationAddress || ""}
                    label="Pickup Location"
                />
            </Grid>
            <Grid item xs={12}>
                <Map
                    lat={passengerData.dropoffLocationLatitude || ""}
                    lng={passengerData.dropoffLocationLongitude || ""}
                    address={passengerData.dropoffLocationAddress || ""}
                    label="Pickup Location"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="requestTime"
                    label="Request Time"
                    type="datetime-local"
                    value={passengerData.requestTime}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }} // Đảm bảo label không bị lặp lại khi giá trị được điền vào
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
            </Grid>
        </Grid>
    );
}

const SCR_ID = "SCR_SAR_CREATE_PASSENGER_REQUEST";
export default withScreenSecurity(CreatePassengerRequest, SCR_ID, true);
