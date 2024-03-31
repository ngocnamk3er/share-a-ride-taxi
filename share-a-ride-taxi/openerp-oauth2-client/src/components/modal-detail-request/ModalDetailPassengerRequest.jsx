import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { Typography, CircularProgress, Grid } from "@mui/material";
import RoutingMap from "../../components/findroute/RoutingMap";
import withScreenSecurity from 'components/common/withScreenSecurity';
const ModalDetailPassengerRequest = props => {

    const { request } = props

    console.log("xxxxxxxxxxx")
    console.log(request)
    console.log("xxxxxxxxxxx")

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                margin: "auto",
                width: "80vw",
                height: "80vh",
                backgroundColor: "#fff",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                padding: "20px",
            }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h4" gutterBottom>
                        Passenger Request Detail
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>
                        <strong>Passenger Name:</strong> {request.passengerName}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>
                        <strong>Phone Number:</strong> {request.phoneNumber}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>
                        <strong>Email:</strong> {request.email || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>
                        <strong>Pickup Location Address:</strong> {request.pickupLocationAddress || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography>
                        <strong>Dropoff Location Address:</strong> {request.dropoffLocationAddress || 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography>
                        <strong>Request Time:</strong> {new Date(request.requestTime).toLocaleString()}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography>
                        <strong>Status ID:</strong> {request.statusId}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <RoutingMap style={{ width: "100%", height: "45vh" }}
                        pickupLocation={{ lat: request.pickupLocationLatitude, lon: request.pickupLocationLongitude }}
                        dropoffLocation={{ lat: request.dropoffLocationLatitude, lon: request.dropoffLocationLongitude }}
                    />
                </Grid>
            </Grid>
        </div>
    )
}

ModalDetailPassengerRequest.propTypes = {}

export default ModalDetailPassengerRequest