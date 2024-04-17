import React, { useState } from "react";
import { Typography, Grid, TextField, Button, Modal } from "@mui/material";
import SearchLocation from '../../components/searchLocation/SearchLocation';
import { request } from "../../api";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useHistory } from "react-router-dom";

const CreateParcelRequest = () => {

    const history = useHistory();

    const RECEIVED = 1;

    const [parcelData, setParcelData] = useState({
        senderName: "",
        senderPhoneNumber: "",
        senderEmail: "",
        recipientName: "",
        recipientPhoneNumber: "",
        recipientEmail: "",
        pickupLatitude: "",
        pickupLongitude: "",
        pickupAddress: "",
        dropoffLatitude: "",
        dropoffLongitude: "",
        dropoffAddress: "",
        requestTime: "",
        statusId: RECEIVED, // Default status ID
    });

    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showDropoffModal, setShowDropoffModal] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setParcelData({ ...parcelData, [name]: value });
    };

    const handleSelectPosition = (position, locationType) => {
        if (locationType === 'pickup') {
            setParcelData({
                ...parcelData,
                pickupLatitude: position.lat,
                pickupLongitude: position.lon,
                pickupAddress: position.display_name
            });
            setShowPickupModal(false);
        } else if (locationType === 'dropoff') {
            setParcelData({
                ...parcelData,
                dropoffLatitude: position.lat,
                dropoffLongitude: position.lon,
                dropoffAddress: position.display_name
            });
            setShowDropoffModal(false);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await request(
                "post",
                "/parcel-requests",
                (response) => {
                    console.log("Parcel request created successfully:", response.data);
                    // Clear form after successful submission
                    setParcelData({
                        senderName: "",
                        senderPhoneNumber: "",
                        senderEmail: "",
                        recipientName: "",
                        recipientPhoneNumber: "",
                        pickupLatitude: "",
                        pickupLongitude: "",
                        pickupAddress: "",
                        dropoffLatitude: "",
                        dropoffLongitude: "",
                        dropoffAddress: "",
                        requestTime: "",
                        statusId: 1 // Reset status ID
                    });
                    history.push("/parcel-request/list");
                },
                {
                    400: (error) => {
                        console.error("Error creating parcel request:", error);
                    }
                },
                parcelData
            );
        } catch (error) {
            console.error("Error creating parcel request:", error);
        }
    };


    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Create Parcel Request</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h6">Sender's Info</Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h6">Recipient's Info</Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="senderName"
                    label="Sender Name"
                    value={parcelData.senderName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="recipientName"
                    label="Recipient Name"
                    value={parcelData.recipientName}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="senderPhoneNumber"
                    label="Sender Phone Number"
                    value={parcelData.senderPhoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="recipientPhoneNumber"
                    label="Recipient Phone Number"
                    value={parcelData.recipientPhoneNumber}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="senderEmail"
                    label="Sender Email"
                    value={parcelData.senderEmail}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="recipientEmail"
                    label="Recipient Email"
                    value={parcelData.recipientEmail}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="pickupAddress"
                    label="Pickup Location"
                    value={parcelData.pickupAddress}
                    onClick={() => setShowPickupModal(true)}
                    fullWidth
                    required
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                />
                <Modal
                    open={showPickupModal}
                    onClose={() => setShowPickupModal(false)}
                    aria-labelledby="pickup-location-modal"
                    aria-describedby="select-pickup-location"
                >
                    <div>
                        <SearchLocation
                            centerPos={parcelData.pickupLatitude ? [parcelData.pickupLatitude, parcelData.pickupLongitude] : null}
                            setPosition={(position) => handleSelectPosition(position, 'pickup')}
                            onClose={() => setShowPickupModal(false)}
                        />
                    </div>
                </Modal>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="dropoffAddress"
                    label="Dropoff Location"
                    value={parcelData.dropoffAddress}
                    onClick={() => setShowDropoffModal(true)}
                    fullWidth
                    required
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                />
                <Modal
                    open={showDropoffModal}
                    onClose={() => setShowDropoffModal(false)}
                    aria-labelledby="dropoff-location-modal"
                    aria-describedby="select-dropoff-location"
                >
                    <div>
                        <SearchLocation
                            centerPos={parcelData.dropoffLatitude ? [parcelData.dropoffLatitude, parcelData.dropoffLongitude] : null}
                            setPosition={(position) => handleSelectPosition(position, 'dropoff')}
                            onClose={() => setShowDropoffModal(false)}
                        />
                    </div>
                </Modal>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    name="requestTime"
                    label="Request Time"
                    type="datetime-local"
                    value={parcelData.requestTime}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Submit</Button>
            </Grid>
        </Grid>
    );
}

const SCR_ID = "SCR_SAR_CREATE_PARCEL_REQUEST";
export default withScreenSecurity(CreateParcelRequest, SCR_ID, true);

