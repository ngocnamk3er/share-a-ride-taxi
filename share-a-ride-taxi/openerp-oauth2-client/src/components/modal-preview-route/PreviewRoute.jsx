import React, { useState } from "react";
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import RoutingMapTwoPoint from '../../components/findroute/RoutingMapTwoPoint';

const PreviewRoute = (props) => {
    const { assignedRequests } = props;
    const locations = [];

    const [center, setCenter] = useState(null);

    assignedRequests.forEach(req => {
        locations.push({ lat: req.pickupLatitude, lon: req.pickupLongitude });
        locations.push({ lat: req.dropoffLatitude, lon: req.dropoffLongitude });
    });

    const handlePickUpCellClick = (request) => {
        setCenter([request.pickupLatitude, request.pickupLongitude]);
    };

    const handleDropOffCellClick = (request) => {
        setCenter([request.dropoffLatitude, request.dropoffLongitude]);
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
                                    <TableCell className="clickable-cell" onClick={() => handlePickUpCellClick(request)}>{request.pickupAddress}</TableCell>
                                    <TableCell className="clickable-cell" onClick={() => handleDropOffCellClick(request)}>{request.dropoffAddress}</TableCell>
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
