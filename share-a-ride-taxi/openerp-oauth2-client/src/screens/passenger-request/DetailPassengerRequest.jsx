import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { Typography, CircularProgress, Grid } from "@mui/material";
import RoutingMapTwoPoint from "../../components/findroute/RoutingMapTwoPoint";
import withScreenSecurity from 'components/common/withScreenSecurity';

const DetailPassengerRequest = () => {
    const [passengerRequest, setPassengerRequest] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPassengerRequest = async () => {
            try {
                const response = await request("get", `/passenger-requests/${id}`);
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
                <Typography variant="h4" gutterBottom>
                    Passenger Request Detail
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>ID:</strong> {passengerRequest.id}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Passenger Name:</strong> {passengerRequest.passengerName}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Phone Number:</strong> {passengerRequest.phoneNumber}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Email:</strong> {passengerRequest.email || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Pickup Location Address:</strong> {passengerRequest.pickupLocationAddress || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Dropoff Location Address:</strong> {passengerRequest.dropoffLocationAddress || 'N/A'}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Request Time:</strong> {new Date(passengerRequest.requestTime).toLocaleString()}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Typography>
                    <strong>Status ID:</strong> {passengerRequest.statusId}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <RoutingMapTwoPoint style={{ width: "100%", height: "80vh" }}
                    pickupLocation={{ lat: passengerRequest.pickupLocationLatitude, lon: passengerRequest.pickupLocationLongitude }}
                    dropoffLocation={{ lat: passengerRequest.dropoffLocationLatitude, lon: passengerRequest.dropoffLocationLongitude }}
                />
            </Grid>
        </Grid>
    );
}

const SCR_ID = "SCR_SAR_DETAIL_PASSENGER_REQUEST";
export default withScreenSecurity(DetailPassengerRequest, SCR_ID, true);
