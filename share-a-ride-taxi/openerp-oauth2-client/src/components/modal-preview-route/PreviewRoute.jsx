import React, { useState } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import RoutingMapTwoPoint from '../../components/findroute/RoutingMapTwoPoint';

const PreviewRoute = (props) => {
    const { assignedRequests } = props;
    const locations = [];

    const [center, setCenter] = useState(null);

    assignedRequests.forEach(req => {
        locations.push({ lat: req.pickupLocationLatitude, lon: req.pickupLocationLongitude });
        locations.push({ lat: req.dropoffLocationLatitude, lon: req.dropoffLocationLongitude });
    });

    const handlePickUpCellClick = (request) => {
        setCenter([request.pickupLocationLatitude, request.pickupLocationLongitude]);
    };

    const handleDropOffCellClick = (request) => {
        setCenter([request.dropoffLocationLatitude, request.dropoffLocationLongitude]);
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
                display: "flex"
            }}
        >
            <div style={{ flex: "40%", paddingRight: "10px" }}>
                <TableContainer component={Paper} style={{ height: "100%" }}>
                    <Table style={{ height: "100%" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Pickup Location</TableCell>
                                <TableCell>Dropoff Location</TableCell>
                                <TableCell>Request Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assignedRequests.map((request, index) => (
                                <TableRow key={request.id} style={{ backgroundColor: index % 2 === 0 ? '#f0f0f0' : 'transparent' }}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell className="clickable-cell" onClick={() => handlePickUpCellClick(request)}>{request.pickupLocationAddress}</TableCell>
                                    <TableCell className="clickable-cell" onClick={() => handleDropOffCellClick(request)}>{request.dropoffLocationAddress}</TableCell>
                                    <TableCell>{request.requestTime}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div style={{ flex: "60%" }}>
                <RoutingMapTwoPoint style={{ width: "100%", height: "100%" }} listLocation={locations} center={center} />
            </div>
        </div>
    );
}

export default PreviewRoute;
