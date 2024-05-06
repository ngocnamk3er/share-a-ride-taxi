import React, { useState, useEffect } from "react";
import { Typography, TextField, Button, Grid, Container, Dialog, DialogContent, DialogTitle, Select, MenuItem, FormControl, InputLabel, Modal } from "@mui/material";
import SearchLocation from '../../components/searchLocation/SearchLocation';
import { request } from "../../api";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PreviewIcon from '@mui/icons-material/Preview';
import keycloak from "config/keycloak";
import { jwtDecode } from "jwt-decode";
import { useHistory } from "react-router-dom";

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
        address: ""
    });

    const [showModal, setShowModal] = useState(false);

    const [fileData, setFileData] = useState({
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
    const history = useHistory();

    useEffect(() => {
        const token = keycloak.token
        if (token) {
            const decodedToken = jwtDecode(token);
            const { preferred_username, given_name, family_name } = decodedToken;
            const fullName = given_name + " " + family_name;
            const userId = preferred_username;
            setDriverInfo(prevState => ({
                ...prevState,
                userId,
                fullName
            }));


        }
        const checkDriverExists = async () => {
            try {
                const response = await request("get", `/drivers/user/${driverInfo.userId}`);
                if (response.data) {
                    history.push("/for-driver/info"); // Chuyển hướng đến màn hình DriverInfo nếu tài xế đã tồn tại
                }
            } catch (error) {
                console.error("Error checking driver existence:", error);
            }
        };

        checkDriverExists();
    }, [driverInfo.userId, history]);

    const handleSetPosition = (position) => {
        setDriverInfo(prevDriverInfo => ({
            ...prevDriverInfo,
            lat: position.lat,
            lon: position.lon,
            address: position.display_name
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDriverInfo({ ...driverInfo, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFileData({ ...fileData, [name]: files[0] });

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

            // Add driver info to formData under "driverInfo" key
            formData.append("driverInfo", JSON.stringify(driverInfo));

            // Add files to formData
            formData.append("avatarFile", fileData.avatarFile);
            formData.append("licensePhotoFile", fileData.licensePhotoFile);
            formData.append("vehiclePhotoFile", fileData.vehiclePhotoFile);
            formData.append("licensePlatePhotoFile", fileData.licensePlatePhotoFile);

            console.log("formData:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            await request("post", "/drivers", (res) => {
                console.log("Request created successfully:", res.data);
                history.push("/for-driver/info");
            }, null, formData);
        } catch (error) {
            console.error("Error registering driver:", error);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h3" align="center" gutterBottom>Register Driver</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="fullName"
                            label="Full Name"
                            value={driverInfo.fullName}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="userId"
                            label="User Id"
                            value={driverInfo.userId}
                            onChange={handleChange}
                            fullWidth
                            required
                            InputProps={{
                                readOnly: true,
                            }}
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
                        <FormControl fullWidth>
                            <InputLabel id="gender-label">Gender</InputLabel>
                            <Select
                                labelId="gender-label"
                                id="gender"
                                onChange={handleChange}
                                value={driverInfo.gender}
                                name="gender"
                                label="Gender"
                                required
                            >
                                <MenuItem value={"Male"}>Male</MenuItem>
                                <MenuItem value={"Female"}>Female</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="vehicle-type-label">Vehicle Type</InputLabel>
                            <Select
                                labelId="vehicle-type-label"
                                id="vehicle-type"
                                value={driverInfo.vehicleTypeId}
                                onChange={handleChange}
                                label="Vehicle Type"
                                required
                                name="vehicleTypeId"
                            >
                                <MenuItem value={0}>Car</MenuItem>
                                <MenuItem value={1}>Mini Truck</MenuItem>
                                <MenuItem value={2}>Truck</MenuItem>
                            </Select>
                        </FormControl>
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
                    <Grid item xs={6}>
                        <TextField
                            name="dropoffAddress"
                            label="Address"
                            value={driverInfo.address}
                            onClick={() => setShowModal(true)}
                            fullWidth
                            required
                            InputProps={{ readOnly: true }}
                            InputLabelProps={{ shrink: true }}
                        />
                        <Modal
                            open={showModal}
                            onClose={() => setShowModal(false)}
                            aria-labelledby="dropoff-location-modal"
                            aria-describedby="select-dropoff-location"
                        >
                            <div>
                                <SearchLocation
                                    centerPos={driverInfo.lat ? [driverInfo.lat, driverInfo.lon] : null}
                                    setPosition={(position) => handleSetPosition(position)}
                                    onClose={() => {
                                        setShowModal(false)
                                    }}
                                />
                            </div>
                        </Modal>
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
                        <Button onClick={() => handlePreview(fileData.avatarFile)}><PreviewIcon /></Button>
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
                        <Button onClick={() => handlePreview(fileData.licensePhotoFile)}><PreviewIcon /></Button>
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
                        <Button onClick={() => handlePreview(fileData.vehiclePhotoFile)}><PreviewIcon /></Button>
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
                        <Button onClick={() => handlePreview(fileData.licensePlatePhotoFile)}><PreviewIcon /></Button>
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
