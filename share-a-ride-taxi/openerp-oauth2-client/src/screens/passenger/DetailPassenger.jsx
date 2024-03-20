import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { Typography, CircularProgress, Grid } from "@mui/material";
import Map from "../../components/Map";

const DetailPassenger = () => {
    const [passengerRequest, setPassengerRequest] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPassengerRequest = async () => {
            try {
                const response = await request("get", `http://localhost:8080/api/passenger-requests/${id}`);
                setPassengerRequest(response.data);
            } catch (error) {
                console.error("Error fetching passenger request:", error);
            }
        };

        fetchPassengerRequest();
    }, [id]);

    if (!passengerRequest) {
        return <CircularProgress />;
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Passenger Request Detail</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>ID: {passengerRequest.id}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Passenger Name: {passengerRequest.passengerName}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Phone Number: {passengerRequest.phoneNumber}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Email: {passengerRequest.email || 'N/A'}</Typography>
            </Grid>
            {/* Add Map component with pickupLocation and dropoffLocation */}
            <Grid item xs={12}>
                <Map pickupLocation={{ lat: passengerRequest.pickupLocationLatitude, lon: passengerRequest.pickupLocationLongitude }}
                    dropoffLocation={{ lat: passengerRequest.dropoffLocationLatitude, lon: passengerRequest.dropoffLocationLongitude }} />
            </Grid>
            <Grid item xs={12}>
                <Typography>Request Time: {new Date(passengerRequest.requestTime).toLocaleString()}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>Status ID: {passengerRequest.statusId}</Typography>
            </Grid>
        </Grid>
    );
}

export default DetailPassenger;
