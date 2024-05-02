import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Typography, CircularProgress, Grid } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DetailDriver = ({ driver }) => {
    if (!driver) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <CircularProgress />
            </div>
        );
    }

    const statusLookup = {
        0: "Waiting",
        1: "Active",
        2: "Inactive",
    };

    const vehicleTypeLookup = {
        0: "Car",
        1: "Small Truck",
        2: "Truck",
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

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
                zIndex: 9999,
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Typography variant="h4" gutterBottom>
                        Driver's info
                    </Typography>
                    <br />
                    <Typography variant="h6" gutterBottom>
                        Full name : {driver.fullName}
                    </Typography>
                    <br />
                    <Typography variant="h6" gutterBottom>
                        Phone number : {driver.phoneNumber}
                    </Typography>
                    <br />
                    <Typography variant="h6" gutterBottom>
                        Gender : {driver.gender}
                    </Typography>
                    <br />
                    <Typography variant="h6" gutterBottom>
                        Address : {driver.address}
                    </Typography>
                    <br />
                    <Typography variant="h6" gutterBottom>
                        Status : {statusLookup[driver.statusId]}
                    </Typography>
                    <br />
                    <Typography variant="h6" gutterBottom>
                        Vehicle type : {vehicleTypeLookup[driver.vehicleTypeId]}
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Slider {...settings}>
                        <div>
                            <img src={driver.avatarUrl} alt="Avatar" style={{ height: "75vh", objectFit: "cover" }} />
                        </div>
                        <div>
                            <img src={driver.vehiclePhotoUrl} alt="Vehicle" style={{ height: "75vh", objectFit: "cover" }} />
                        </div>
                        <div>
                            <img src={driver.licensePhotoUrl} alt="License" style={{ height: "75vh", objectFit: "cover" }} />
                        </div>
                        <div>
                            <img src={driver.licensePlatePhotoUrl} alt="License Plate" style={{ height: "75vh", objectFit: "cover" }} />
                        </div>
                    </Slider>
                </Grid>
            </Grid>
        </div>
    );
}

export default DetailDriver;
