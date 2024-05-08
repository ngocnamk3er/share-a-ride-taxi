import React, { useEffect, useState } from "react";
import { request } from "../../api";
import { Typography, CircularProgress, Grid } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withScreenSecurity from 'components/common/withScreenSecurity';
import keycloak from "config/keycloak";
import { jwtDecode } from "jwt-decode";

const DriverInfo = () => {
    const [driverInfo, setDriverInfo] = useState(null);
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const statusLookup = {
        0: { label: "Waiting", color: "#FFC107" },
        1: { label: "Active", color: "#4CAF50" },
        2: { label: "Inactive", color: "#F44336" },
    };

    const vehicleTypeLookup = {
        0: "Car",
        1: "Small Truck",
        2: "Truck",
    };

    useEffect(() => {
        const token = keycloak.token;
        const decodedToken = jwtDecode(token);
        const { preferred_username } = decodedToken;
        const userId = preferred_username;
        const fetchDriverInfo = async () => {
            try {
                const response = await request("get", `/drivers/user/${userId}`);
                setDriverInfo(response.data);
            } catch (error) {
                console.error("Error fetching driver info:", error);
            }
        };

        fetchDriverInfo();
    }, []);

    if (!driverInfo) {
        return <CircularProgress />;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Driver Information
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography>
                        <strong>Full Name:</strong> {driverInfo.fullName}
                    </Typography>
                    <Typography>
                        <strong>Phone Number:</strong> {driverInfo.phoneNumber}
                    </Typography>
                    <Typography>
                        <strong>Gender:</strong> {driverInfo.gender}
                    </Typography>
                    <Typography>
                        <strong>Vehicle Type:</strong> {vehicleTypeLookup[driverInfo.vehicleTypeId]}
                    </Typography>
                    <Typography>
                        <strong>Payload Capacity:</strong> {driverInfo.payloadCapacity}
                    </Typography>
                    <Typography>
                        <strong>Volume:</strong> {driverInfo.seatingCapacity}
                    </Typography>
                    <Typography>
                        <strong>Vehicle License Plate:</strong> {driverInfo.vehicleLicensePlate}
                    </Typography>
                    <Typography>
                        <strong>Address:</strong> {driverInfo.address + " / " + driverInfo.addressNote}
                    </Typography>

                    <Typography>
                        <strong>Status:</strong>{" "}
                        <div style={{ border: "1px solid", borderColor: statusLookup[driverInfo.statusId].color, borderRadius: "5px", padding: "2px", display: "inline-block" }}>
                            <Typography component="span" variant="body1" style={{ color: statusLookup[driverInfo.statusId].color }}>
                                {statusLookup[driverInfo.statusId].label}
                            </Typography>
                        </div>
                    </Typography>
                    <Typography>
                        <strong>User ID:</strong> {driverInfo.userId}
                    </Typography>
                    <Typography>
                        <strong>Created At:</strong> {new Date(driverInfo.createdAt).toLocaleString()}
                    </Typography>
                    <Typography>
                        <strong>Updated At:</strong> {new Date(driverInfo.updatedAt).toLocaleString()}
                    </Typography>
                    <Typography>
                        <strong>Latitude:</strong> {driverInfo.lat}
                    </Typography>
                    <Typography>
                        <strong>Longitude:</strong> {driverInfo.lon}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Driver Photos
                    </Typography>
                    <Slider style={{ width: '50%' }} {...sliderSettings}>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Driver Avatar
                            </Typography>
                            <img src={driverInfo.avatarUrl} alt="Driver Avatar" style={{ width: '100%', height: 'auto', objectFit: "cover" }} />
                        </div>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Vehicle
                            </Typography>
                            <img src={driverInfo.vehiclePhotoUrl} alt="Vehicle" style={{ width: '100%', height: 'auto', objectFit: "cover" }} />
                        </div>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                License
                            </Typography>
                            <img src={driverInfo.licensePhotoUrl} alt="License" style={{ width: '100%', height: 'auto', objectFit: "cover" }} />
                        </div>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                License Plate
                            </Typography>
                            <img src={driverInfo.licensePlatePhotoUrl} alt="License Plate" style={{ width: '100%', height: 'auto', objectFit: "cover" }} />
                        </div>
                    </Slider>
                </Grid>
            </Grid>
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(DriverInfo, SCR_ID, true);
