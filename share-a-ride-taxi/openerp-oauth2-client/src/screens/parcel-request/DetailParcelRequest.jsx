import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { Typography, CircularProgress, Grid } from "@mui/material";
import RoutingMap from "../../components/findroute/RoutingMap";
import withScreenSecurity from 'components/common/withScreenSecurity';

const DetailParcelRequest = () => {
    const [parcelRequest, setParcelRequest] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchParcelRequest = async () => {
            try {
                const response = await request("get", `/parcel-requests/${id}`);
                setParcelRequest(response.data);
            } catch (error) {
                console.error("Error fetching parcel request:", error);
            }
        };

        fetchParcelRequest();
    }, [id]);

    if (!parcelRequest) {
        return <CircularProgress />;
    }

    return (
        <Grid container spacing={2}>
            <Typography variant="h4" gutterBottom>
                Parcel Request Detail
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography>
                        <strong>ID:</strong> {parcelRequest.id}
                    </Typography>
                    <Typography>
                        <strong>Sender Name:</strong> {parcelRequest.senderName}
                    </Typography>
                    <Typography>
                        <strong>Sender Phone Number:</strong> {parcelRequest.senderPhoneNumber}
                    </Typography>
                    <Typography>
                        <strong>Sender Email:</strong> {parcelRequest.senderEmail}
                    </Typography>
                    <Typography>
                        <strong>Pickup Location:</strong> {parcelRequest.pickupLocationAddress}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>
                        <strong>Recipient Name:</strong> {parcelRequest.recipientName}
                    </Typography>
                    <Typography>
                        <strong>Recipient Phone Number:</strong> {parcelRequest.recipientPhoneNumber}
                    </Typography>
                    <Typography>
                        <strong>Recipient Email:</strong> {parcelRequest.recipientEmail}
                    </Typography>
                    <Typography>
                        <strong>Request Time:</strong> {new Date(parcelRequest.requestTime).toLocaleString()}
                    </Typography>

                    <Typography>
                        <strong>Dropoff Location:</strong> {parcelRequest.dropoffLocationAddress}
                    </Typography>
                </Grid>
            </Grid>
            <br />
            <Typography>
                <strong>Status ID:</strong> {parcelRequest.statusId}
            </Typography>
            <RoutingMap
                pickupLocation={{ lat: parcelRequest.pickupLocationLatitude, lon: parcelRequest.pickupLocationLongitude }}
                dropoffLocation={{ lat: parcelRequest.dropoffLocationLatitude, lon: parcelRequest.dropoffLocationLongitude }}
            />
        </Grid>
    );
}

const SCR_ID = "SCR_SAR_DETAIL_PARCEL_REQUEST";
export default withScreenSecurity(DetailParcelRequest, SCR_ID, true);
