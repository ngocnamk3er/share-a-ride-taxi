import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { Typography, CircularProgress, Grid, Avatar } from "@mui/material";
import withScreenSecurity from 'components/common/withScreenSecurity';
import keycloak from "config/keycloak";
import { jwtDecode } from "jwt-decode";

const DriverInfo = () => {
    const [driverInfo, setDriverInfo] = useState(null);

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
                        <strong>Vehicle Type:</strong> {driverInfo.vehicleTypeId}
                    </Typography>
                    <Typography>
                        <strong>Vehicle License Plate:</strong> {driverInfo.vehicleLicensePlate}
                    </Typography>
                    <Typography>
                        <strong>Address:</strong> {driverInfo.address}
                    </Typography>
                    <Typography>
                        <strong>Status:</strong> {driverInfo.statusId}
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Driver Avatar
                            </Typography>
                            <img src={driverInfo.avatarUrl} alt="Driver Avatar" style={{ maxWidth: 200, height: 'auto' }} />
                        </div>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                Vehicle
                            </Typography>
                            <img src={driverInfo.vehiclePhotoUrl} alt="Vehicle" style={{ maxWidth: 200, height: 'auto' }} />
                        </div>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                License
                            </Typography>
                            <img src={driverInfo.licensePhotoUrl} alt="License" style={{ maxWidth: 200, height: 'auto' }} />
                        </div>
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
                                License Plate
                            </Typography>
                            <img src={driverInfo.licensePlatePhotoUrl} alt="License Plate" style={{ maxWidth: 200, height: 'auto' }} />
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(DriverInfo, SCR_ID, true);
