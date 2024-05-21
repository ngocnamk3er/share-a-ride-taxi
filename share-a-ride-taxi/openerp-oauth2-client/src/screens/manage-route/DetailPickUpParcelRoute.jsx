import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField, Button } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router-dom";
import { request } from "../../api";

const DetailPickUpParcelRoute = () => {
    const [routePickup, setRoutePickup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const match = useRouteMatch();
    const history = useHistory();
    const { id } = match.params;

    const fetchRoutePickup = async () => {
        try {
            const response = await request('get',`/route-pickups/${id}`);
            setRoutePickup(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoutePickup();
    }, [id]);

    const handleRefresh = () => {
        setLoading(true);
        setError(null);
        setRoutePickup(null);
        fetchRoutePickup();
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <h1>Route {id} Details</h1>
            {routePickup && (
                <div>
                    <TextField
                        label="Driver ID"
                        value={routePickup.driverId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Start Execute Time"
                        value={routePickup.startExecuteStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Updated Time"
                        value={routePickup.lastUpdatedStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Created Time"
                        value={routePickup.createdStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="End Time"
                        value={routePickup.endStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Route Status ID"
                        value={routePickup.routeStatusId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Warehouse ID"
                        value={routePickup.wareHouseId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button> */}
                    {/* <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => history.push('/edit-route/' + id)}
                        style={{ marginLeft: '10px' }}
                    >
                        Edit
                    </Button> */}
                </div>
            )}
        </div>
    );
};

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(DetailPickUpParcelRoute, SCR_ID, true);
