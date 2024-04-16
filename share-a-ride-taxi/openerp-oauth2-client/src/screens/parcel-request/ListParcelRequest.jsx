import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';

const ListParcelRequest = () => {
    const [parcelRequests, setParcelRequests] = useState([]);
    const history = useHistory(); // Initialize useHistory hook
    let { path } = useRouteMatch();

    useEffect(() => {
        fetchParcelRequests();
    }, []);

    const fetchParcelRequests = () => {
        request("get", "/parcel-requests", (res) => {
            setParcelRequests(res.data);
        }).then();
    }

    const handleRowClick = (event, rowData) => {
        // Navigate to new URL without page reload
        history.push(`${path}/${rowData.id}`);
    }

    const handleEditClick = (rowData) => {
        // Navigate to edit page for selected parcel request
        history.push(`/parcel-request/update/${rowData.id}`);
    }

    const handleDeleteClick = (rowData) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this parcel request?");
        if (confirmDelete) {
            request("delete", `/parcel-requests/${rowData.id}`, () => {
                // Remove the deleted parcel request from the state
                setParcelRequests(prevState => prevState.filter(request => request.id !== rowData.id));
            }).then(() => {
                alert("Parcel request deleted successfully.");
            }).catch(error => {
                alert("Error deleting parcel request: " + error.message);
            });
        }
    }

    const handleViewClick = (rowData) => {
        // Navigate to view page for selected parcel request
        history.push(`${path}/${rowData.id}`);
    }

    const columns = [
        {
            title: "Sender Name",
            field: "senderName",
        },
        {
            title: "Recipient Name",
            field: "recipientName",
        },
        {
            title: "Request Time",
            field: "requestTime",
        },
        {
            title: "Pickup Location Address",
            field: "pickupLocationAddress",
        },
        {
            title: "Dropoff Location Address",
            field: "dropoffLocationAddress",
        },
        {
            title: "Status",
            field: "requestStatus",
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
                title="Parcel Request List"
                columns={columns}
                data={parcelRequests}
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

const SCR_ID = "SCR_SAR_LIST_PARCEL_REQUEST";
export default withScreenSecurity(ListParcelRequest, SCR_ID, true);
