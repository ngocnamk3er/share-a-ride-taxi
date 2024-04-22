import React, { useState } from "react";
import { useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { Typography, TextField, Button, Grid } from "@mui/material";
import { useHistory } from "react-router-dom";
import { request } from "../../api";
import { useParams } from 'react-router-dom';

const CreateRouteForDriver = () => {
    const history = useHistory();
    const [driver, setDriver] = useState([]);
    const { id } = useParams();
    // State để lưu thông tin về route
    const [routeData, setRouteData] = useState({
        title: "",
        description: "",
        area: "", // Thêm trường area
        lat: "", // Thêm trường lat
        lon: "",  // Thêm trường lon
        driverId: "",
        startExecutionStamp: "" // Thêm trường startExecutionStamp
    });

    useEffect(() => {
        request("get", `/drivers/${id}`, (res) => {
            setDriver(res.data);
        }).then();

    }, [id]);
    // Hàm xử lý khi người dùng thay đổi các trường nhập liệu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRouteData({ ...routeData, [name]: value });
    };

    // Hàm xử lý khi người dùng nhấn nút "Save"
    const handleSaveRoute = async () => {
        try {
            // Gửi yêu cầu API để tạo route mới
            const response = await request("post", "/routes", (res) => {
                console.log("Route created successfully:", res.data);
                const currentPath = history.location.pathname; // Lấy đường dẫn hiện tại
                const newPath = currentPath.replace('/create-route', '/list-routes'); // Loại bỏ
                history.push(newPath); // Chuyển hướng đến đường dẫn mới
            }, null, { ...routeData, ['driverId']: driver.id });
        } catch (error) {
            console.error("Error creating route:", error);
            // Xử lý lỗi nếu cần thiết
        }
    };

    return (
        <div>
            <Typography style={{ marginBottom: '16px' }} variant="h4">Create route for driver {driver.fullName}</Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        name="title"
                        label="Title"
                        value={routeData.title}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="description"
                        label="Description"
                        value={routeData.description}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="area"
                        label="Area"
                        value={routeData.area}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="lat"
                        label="Latitude"
                        value={routeData.lat}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="lon"
                        label="Longitude"
                        value={routeData.lon}
                        onChange={handleInputChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="startExecutionStamp"
                        label="Start Execution Stamp"
                        type="datetime-local"
                        value={routeData.startExecutionStamp}
                        onChange={handleInputChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSaveRoute}>Save</Button>
                </Grid>
            </Grid>
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(CreateRouteForDriver, SCR_ID, true);
