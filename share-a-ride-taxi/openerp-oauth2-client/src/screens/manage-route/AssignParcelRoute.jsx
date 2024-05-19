import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CircularProgress } from "@mui/material";

const AssignParcelRoute = () => {
    const [parcelRequests, setParcelRequests] = useState([]);
    const history = useHistory(); // Initialize useHistory hook
    const [loading, setLoading] = useState(false)
    let { path } = useRouteMatch();

    useEffect(() => {
        fetchParcelRequests();
    }, []);

    const fetchParcelRequests = () => {
        request("get", "/parcel-requests", (res) => {
            const receivedRequests = res.data.filter(request => request.statusId === 1).reverse();
            setParcelRequests(receivedRequests);
        }).then();
    }

    const handleRowClick = (event, rowData) => {
        // Navigate to new URL without page reload
        history.push(`${path}/${rowData.requestId}`);
    }

    const handleEditClick = (rowData) => {
        // Navigate to edit page for selected parcel request
        history.push(`/parcel-request/update/${rowData.requestId}`);
    }

    const handleDeleteClick = (rowData) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this parcel request?");
        if (confirmDelete) {
            request("delete", `/parcel-requests/${rowData.requestId}`, () => {
                // Remove the deleted parcel request from the state
                setParcelRequests(prevState => prevState.filter(request => request.requestId !== rowData.requestId));
            }).then(() => {
                alert("Parcel request deleted successfully.");
            }).catch(error => {
                alert("Error deleting parcel request: " + error.message);
            });
        }
    }

    const handleViewClick = (rowData) => {
        // Navigate to view page for selected parcel request
        history.push(`${path}/${rowData.requestId}`);
    }

    const handleAutoCreateRoute = async () => {
        setLoading(true)
        try {
            const res = await request("get", "/auto-assign/hello");
            console.log("/auto-assign/hello");
            console.log(res.data);
        } catch (error) {
            console.error("Error sending auto create route request:", error.message);
        } finally {
            setLoading(false)
        }
    }

    // Lookup object for status
    const statusLookup = {
        0: "None",
        1: "Received",
        2: "Driver Assigned",
        3: "In Transit",
        4: "Delivered",
        5: "Cancelled"
    };

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
            title: "End Time",
            field: "endTime",
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
                        handleViewClick(rowData);
                    }}
                    variant="contained"
                    color="primary"
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleAutoCreateRoute}
                style={{ marginBottom: '10px' }}
                disabled={loading} // Disable the button while loading
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Auto Create Route"}
            </Button>
            <StandardTable
                title="List of Unassigned Parcel Requests"
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

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(AssignParcelRoute, SCR_ID, true);
