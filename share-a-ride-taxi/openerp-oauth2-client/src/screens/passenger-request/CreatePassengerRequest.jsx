import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Grid, TextField, Button, Modal } from "@mui/material";
import SearchLocation from '../../components/searchLocation/SearchLocation';
import { request } from "../../api";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useHistory } from "react-router-dom";
import keycloak from "config/keycloak";
import { jwtDecode } from "jwt-decode";


const CreatePassengerRequest = () => {
    const RECEIVED = 1

    const history = useHistory();

    const [passengerData, setPassengerData] = useState({
        passengerName: "",
        phoneNumber: "",
        email: "",
        pickupLatitude: "",
        pickupLongitude: "",
        pickupAddress: "",
        dropoffLatitude: "",
        dropoffLongitude: "",
        dropoffAddress: "",
        requestTime: "",
        statusId: RECEIVED,
        pickupAddressNote: "",
        dropoffAddressNote: "",
        createdByUserLoginId: "",
    });

    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showDropoffModal, setShowDropoffModal] = useState(false);

    useEffect(() => {
        const token = keycloak.token;
        const decodedToken = jwtDecode(token);
        const { preferred_username } = decodedToken;
        const userId = preferred_username;
        setPassengerData(prevParcelData => {
            return { ...prevParcelData, 'createdByUserLoginId': userId };
        });
    }, [])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPassengerData({ ...passengerData, [name]: value });
    };

    const handleSelectPosition = (position, locationType) => {
        if (locationType === 'pickup') {
            setPassengerData({
                ...passengerData,
                pickupLatitude: position.lat,
                pickupLongitude: position.lon,
                pickupAddress: position.display_name
            });
            setShowPickupModal(false);
        } else if (locationType === 'dropoff') {
            setPassengerData({
                ...passengerData,
                dropoffLatitude: position.lat,
                dropoffLongitude: position.lon,
                dropoffAddress: position.display_name
            });
            setShowDropoffModal(false);
        }
    };

    const handleSubmit = async () => {
        console.table(passengerData)
        try {
            const response = await request(
                "post",
                "/passenger-requests",
                (response) => {
                    console.log("Passenger request created successfully:", response.data);
                    // Clear form after successful submission
                    setPassengerData({
                        passengerName: "",
                        phoneNumber: "",
                        email: "",
                    });
                    history.push("/passenger-request/list");
                },
                {
                    400: (error) => {
                        console.error("Error creating passenger request:", error);
                    }
                },
                passengerData
            );
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
            <Grid item xs={6}>
                <TextField
                    name="pickupAddress"
                    label="Pickup Location"
                    value={passengerData.pickupAddress}
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
                            centerPos={passengerData.pickupLatitude ? [passengerData.pickupLatitude, passengerData.pickupLongitude] : null}
                            setPosition={(position) => handleSelectPosition(position, 'pickup')}
                            onClose={() => {
                                setShowPickupModal(false)
                            }}
                        />
                    </div>
                </Modal>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="dropoffAddress"
                    label="Dropoff Location"
                    value={passengerData.dropoffAddress}
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
                            centerPos={passengerData.dropoffLatitude ? [passengerData.dropoffLatitude, passengerData.dropoffLongitude] : null}
                            setPosition={(position) => handleSelectPosition(position, 'dropoff')}
                            onClose={() => {
                                setShowDropoffModal(false)
                            }}
                        />
                    </div>
                </Modal>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="pickupAddressNote"
                    label="Pickup Address Note"
                    value={passengerData.pickupAddressNote}
                    onChange={handleInputChange}
                    fullWidth
                    required
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    name="dropoffAddressNote"
                    label="Drop off Address Note"
                    value={passengerData.dropoffAddressNote}
                    onChange={handleInputChange}
                    fullWidth
                    required
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
                    InputLabelProps={{ shrink: true }}
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
