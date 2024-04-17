import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { Typography, CircularProgress, Link, Button, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import './AddRequestToRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../api";
import RoutingMapTwoPoint from '../../components/findroute/RoutingMapTwoPoint';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const DetailRoute = () => {
    const { routeId } = useParams();
    const [listLocation, setListLocation] = useState([]);
    const [currentRequests, setCurrentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState(null)
    const history = useHistory();
    let { path } = useRouteMatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRouteDetail = await request("get", `/route-details/search?routeId=${routeId}`);
                const routeDetail = resRouteDetail.data;
                const resPassengerRequest = await request("get", `/passenger-requests`);
                const passengerRequest = resPassengerRequest.data;

                const newLocations = passengerRequest.reduce((acc, curr) => {
                    routeDetail.forEach(route => {
                        if (route.requestId === curr.requestId) {
                            acc.push({ lat: curr.pickupLatitude, lon: curr.pickupLongitude });
                            acc.push({ lat: curr.dropoffLatitude, lon: curr.dropoffLongitude });
                            setCurrentRequests(prev => [...prev, curr]);
                        }
                    });
                    return acc;
                }, []);

                setListLocation(newLocations);
                setLoading(false);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [routeId]);

    const handlePickUpCellClick = (request) => {
        setCenter([request.pickupLatitude, request.pickupLongitude]);
    };

    const handleDropOffCellClick = (request) => {
        setCenter([request.dropoffLatitude, request.dropoffLongitude]);
    };

    const handleRowClick = () => {
        const currentPath = history.location.pathname; // Lấy đường dẫn hiện tại
        const newPath = `${currentPath}/addrequests`; // Tạo đường dẫn mới với rowData.id
        history.push(newPath); // Chuyển hướng đến đường dẫn mới
    }
    if (loading) {
        return (
            <div>
                <Typography variant="h4" gutterBottom>
                    List of Requests in route
                </Typography>
                <Button onClick={handleRowClick} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                    Add Request
                </Button>
            </div>
        )
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                List of Requests in route
            </Typography>
            {/* <Link to={`${routeId}/addrequests`} style={{ textDecoration: 'none' }}> */}
            <Button onClick={handleRowClick} variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                Add Request
            </Button>
            {/* </Link> */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Pickup Location</TableCell>
                            <TableCell>Dropoff Location</TableCell>
                            <TableCell>Request Time</TableCell>
                            <TableCell>End Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentRequests.map((request, index) => (
                            <TableRow
                                key={request.id} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'transparent' }}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell className="clickable-cell" onClick={() => handlePickUpCellClick(request)}>{request.pickupAddress}</TableCell>
                                <TableCell className="clickable-cell" onClick={() => handleDropOffCellClick(request)}>{request.dropoffAddress}</TableCell>
                                <TableCell>{request.requestTime}</TableCell>
                                <TableCell>{request.endTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <br />
            <RoutingMapTwoPoint style={{ width: "100%", height: "80vh" }} listLocation={listLocation} center={center} />
        </div >
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailRoute, SCR_ID, true);
