import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Chip from '@mui/material/Chip';
import { useHistory } from "react-router-dom";
import { useRouteMatch } from 'react-router-dom';
import { requestStatusMap, getRequestStatusColor } from "../../config/statusMap"; // Adjust the import path as necessary

const ListPassengerRequest = () => {
    const [passengerRequests, setPassengerRequests] = useState([]);
    const history = useHistory();
    let { path } = useRouteMatch();

    useEffect(() => {
        request("get", "/passenger-requests", (res) => {
            setPassengerRequests(res.data.reverse());
        }).then();
    }, [])

    const handleRowClick = (event, rowData) => {
        history.push(`${path}/${rowData.requestId}`);
    }

    const handleEditClick = (rowData) => {
        history.push(`/passenger-request/update/${rowData.requestId}`);
    }

    const handleDeleteClick = async (rowData) => {
        if (window.confirm("Are you sure you want to delete this passenger request?")) {
            try {
                await request("delete", `/passenger-requests/${rowData.requestId}`);
                alert("Passenger request deleted successfully!");
                setPassengerRequests(prevPassengerRequests => prevPassengerRequests.filter(request => request.requestId !== rowData.requestId));
            } catch (error) {
                alert("Error deleting passenger request!");
            }
        }
    }

    const handleViewClick = (rowData) => {
        history.push(`${path}/${rowData.requestId}`);
    }

    const columns = [
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
            render: (rowData) => (
                <Chip
                    label={requestStatusMap[rowData.statusId]}
                    style={{
                        backgroundColor: getRequestStatusColor(rowData.statusId),
                        color: 'white'
                    }}
                />
            )
        },
        {
            title: "View",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        handleViewClick(rowData);
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
                        handleEditClick(rowData);
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
                        handleDeleteClick(rowData);
                    }}
                    variant="contained"
                    color="error"
                >
                    <DeleteIcon />
                </IconButton>
            ),
        },
    ];

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
