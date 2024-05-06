import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useRouteMatch } from 'react-router-dom';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useHistory } from "react-router-dom";

const ListPassengerRequest = () => {
    const [passengerRequests, setPassengerRequests] = useState([]);
    const history = useHistory(); // Initialize useHistory hook
    let { path } = useRouteMatch();

    const statusLookup = {
        0: "None",
        1: "Received",
        2: "Driver Assigned",
        3: "In Transit",
        4: "Delivered",
        5: "Cancelled"
    };

    useEffect(() => {
        request("get", "/passenger-requests", (res) => {
            setPassengerRequests(res.data.reverse());
        }).then();
    }, [])

    const handleRowClick = (event, rowData) => {
        // Navigate to new URL without page reload
        history.push(`${path}/${rowData.requestId}`);
    }

    const handleEditClick = (rowData) => {
        // Navigate to new URL without page reload
        history.push(`/passenger-request/update/${rowData.requestId}`);
    }

    const handleDeleteClick = (rowData) => {
        // Navigate to new URL without page reload
        history.push(`${path}/${rowData.requestId}`);
    }

    const handleViewClick = (rowData) => {
        // Navigate to new URL without page reload
        history.push(`${path}/${rowData.requestId}`);
    }

    const columns = [
        // {
        //     title: "Passenger Id",
        //     field: "id",
        // },
        {
            title: "Passenger Name",
            field: "passengerName",
        },
        {
            title: "Phone Number",
            field: "phoneNumber",
        },
        {
            title: "Pickup Location Address",
            field: "pickupAddress",
        },
        {
            title: "Dropoff Location Address",
            field: "dropoffAddress",
        },
        {
            title: "Request Time",
            field: "requestTime",
        },
        {
            title: "End Time",
            field: "endTime",
        },
        {
            title: "Status",
            field: "statusId",
            render: (rowData) => statusLookup[rowData.statusId] // Render status label using lookup
        },
        {
            title: "View",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        handleViewClick(rowData)
                    }}
                    variant="contained"
                    color="primary"
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
        {
            title: "Edit",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        handleEditClick(rowData)
                    }}
                    variant="contained"
                    color="success"
                >
                    <EditIcon />
                </IconButton>
            ),
        },
        {
            title: "Delete",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        demoFunction(rowData)
                    }}
                    variant="contained"
                    color="error"
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

    const demoFunction = (passengerRequest) => {
        alert("You clicked on Passenger Request: " + passengerRequest.passengerName)
    }

    return (
        <div>
            <StandardTable
                title="Passenger Request List"
                columns={columns}
                data={passengerRequests}
                options={{
                    selection: false,
                    pageSize: 20,
                    search: true,
                    sorting: true,
                }}
            />
        </div>
    );
}

const SCR_ID = "SCR_SAR_LIST_PASSENGER_REQUEST";
export default withScreenSecurity(ListPassengerRequest, SCR_ID, true);
