import React, { useState } from "react";
import { Typography, TextField, Button, Grid, Container, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { request } from "../../api";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PreviewIcon from '@mui/icons-material/Preview';

const RegisterDriver = () => {
    const [driverInfo, setDriverInfo] = useState({
        userId: "",
        fullName: "",
        phoneNumber: "",
        gender: "",
        vehicleTypeId: "",
        vehicleLicensePlate: "",
        lat: "",
        lon: "",
        address: "",
        avatarFile: null,
        licensePhotoFile: null,
        vehiclePhotoFile: null,
        licensePlatePhotoFile: null
    });


    const [fileNames, setFileNames] = useState({
        avatarFileName: "",
        licensePhotoFileName: "",
        vehiclePhotoFileName: "",
        licensePlatePhotoFileName: ""
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [openPreview, setOpenPreview] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriverInfo({ ...driverInfo, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setDriverInfo({ ...driverInfo, [name]: files[0] });

        const fileName = files[0].name;
        setFileNames({ ...fileNames, [name + "Name"]: fileName });
    };

    const handlePreview = (image) => {
        setPreviewImage(image);
        setOpenPreview(true);
    };

    const handleClosePreview = () => {
        setOpenPreview(false);
        setPreviewImage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            for (const key in driverInfo) {
                formData.append(key, driverInfo[key]);
            }
            await request.post("/drivers", formData);
            alert("Driver registered successfully!");
        } catch (error) {
            console.error("Error registering driver:", error);
            alert("Failed to register driver. Please try again.");
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h3" align="center" gutterBottom>Register Driver</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="userId"
                            label="User ID"
                            value={driverInfo.userId}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="fullName"
                            label="Full Name"
                            value={driverInfo.fullName}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="phoneNumber"
                            label="Phone Number"
                            value={driverInfo.phoneNumber}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="gender"
                            label="Gender"
                            value={driverInfo.gender}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="vehicleTypeId"
                            label="Vehicle Type ID"
                            value={driverInfo.vehicleTypeId}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="vehicleLicensePlate"
                            label="Vehicle License Plate"
                            value={driverInfo.vehicleLicensePlate}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="lat"
                            label="Latitude"
                            value={driverInfo.lat}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="lon"
                            label="Longitude"
                            value={driverInfo.lon}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="address"
                            label="Address"
                            value={driverInfo.address}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    {/* Upload Avatar */}
                    <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>{fileNames.avatarFileName}</Typography>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload Avatar
                            <input
                                type="file"
                                name="avatarFile"
                                onChange={handleFileChange}
                                hidden
                                required
                            />
                        </Button>
                        <Button onClick={() => handlePreview(driverInfo.avatarFile)}><PreviewIcon /></Button>
                    </Grid>
                    {/* Upload License Photo */}
                    <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>{fileNames.licensePhotoFileName}</Typography>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload License Photo
                            <input
                                type="file"
                                name="licensePhotoFile"
                                onChange={handleFileChange}
                                hidden
                                required
                            />
                        </Button>
                        <Button onClick={() => handlePreview(driverInfo.licensePhotoFile)}><PreviewIcon /></Button>
                    </Grid>
                    {/* Upload Vehicle Photo */}
                    <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>{fileNames.vehiclePhotoFileName}</Typography>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload Vehicle Photo
                            <input
                                type="file"
                                name="vehiclePhotoFile"
                                onChange={handleFileChange}
                                hidden
                                required
                            />
                        </Button>
                        <Button onClick={() => handlePreview(driverInfo.vehiclePhotoFile)}><PreviewIcon /></Button>
                    </Grid>
                    {/* Upload License Plate Photo */}
                    <Grid item xs={12}>
                        <Typography variant="body1" gutterBottom>{fileNames.licensePlatePhotoFileName}</Typography>
                        <Button
                            variant="contained"
                            component="label"
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload License Plate Photo
                            <input
                                type="file"
                                name="licensePlatePhotoFile"
                                onChange={handleFileChange}
                                hidden
                                required
                            />
                        </Button>
                        <Button onClick={() => handlePreview(driverInfo.licensePlatePhotoFile)}><PreviewIcon /></Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="primary" type="submit">Register</Button>
                    </Grid>
                </Grid>
            </form>
            <Dialog open={openPreview} onClose={handleClosePreview}>
                <DialogTitle>Preview Image</DialogTitle>
                <DialogContent>
                    {previewImage && <img src={URL.createObjectURL(previewImage)} alt="Preview" style={{ maxWidth: "100%" }} />}
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default RegisterDriver;
