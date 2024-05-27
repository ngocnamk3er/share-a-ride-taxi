import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from "@mui/material/IconButton";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from 'react-router-dom';
import keycloak from "config/keycloak";
import { jwtDecode } from "jwt-decode";

const DriverRoute = () => {
    const [pickupRoutes, setPickupRoutes] = useState();
    const [dropoffRoutes, setDropoffRoutes] = useState();
    const [warehouseRoutes, setWarehouseRoutes] = useState();
    const [driverId, setDriverId] = useState(null);
    const history = useHistory(); // Initialize useHistory hook
    let { path } = useRouteMatch();



    const routeStatusMap = {
        0: "Not Ready",
        1: "Ready",
        2: "Start",
        3: "Complete"
    };

    useEffect(() => {
        // Function to fetch pickup routes
        const fetchPickupRoutes = async (driverId) => {
            try {
                const response = await request('GET', `/route-pickups/driver/${driverId}`);
                setPickupRoutes(response.data);
            } catch (error) {
                console.error("Failed to fetch pickup routes", error);
            }
        };

        // Function to fetch warehouse routes
        const fetchWarehouseRoutes = async (driverId) => {
            try {
                const response = await request('GET', `/route-warehouses/driver/${driverId}`);
                setWarehouseRoutes(response.data);
            } catch (error) {
                console.error("Failed to fetch warehouse routes", error);
            }
        };

        // Function to fetch dropoff routes
        const fetchDropoffRoutes = async (driverId) => {
            try {
                const response = await request('GET', `/route-dropoffs/driver/${driverId}`);
                setDropoffRoutes(response.data);
            } catch (error) {
                console.error("Failed to fetch dropoff routes", error);
            }
        };

        if (driverId) {
            fetchPickupRoutes(driverId);
            fetchWarehouseRoutes(driverId);
            fetchDropoffRoutes(driverId);
        }
    }, [driverId]);


    useEffect(() => {
        if (warehouseRoutes) {
            console.log("check warehouseRoutes :", warehouseRoutes)
        }
    }, [warehouseRoutes])

    useEffect(() => {
        const token = keycloak.token;
        if (token) {
            const decodedToken = jwtDecode(token);
            const { preferred_username } = decodedToken;
            setDriverId(preferred_username)
        }
    }, []);



    const handlePickUpRouteViewClick = (rowData) => {
        history.push(`${path}/pick-up-route/${rowData.id}`);
    }

    const handleWarehouseViewClick = (rowData) => {
        history.push(`${path}/warehouse-route/${rowData.id}`);
    }

    const handleDropOffViewClick = (rowData) => {
        history.push(`${path}/drop-off-route/${rowData.id}`);
    }


    const columnsPickUp = [
        {
            title: 'ID',
            field: 'id'
        },
        {
            title: 'Driver ID',
            field: 'driverId'
        },
        // { title: 'Start Execute Stamp', field: 'startExecuteStamp' },
        // { title: 'End Stamp', field: 'endStamp', key: 'endStamp' },
        // { title: 'Last Updated Stamp', field: 'lastUpdatedStamp' },
        // { title: 'Created Stamp', field: 'createdStamp' },
        {
            title: 'Route Status ID',
            field: 'routeStatusId',
            render: (rowData) => routeStatusMap[rowData.routeStatusId] // Render status label using lookup
        },
        {
            title: 'Warehouse ID',
            field: 'wareHouseId'
        },
        {
            title: "View",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        handlePickUpRouteViewClick(rowData)
                    }}
                    variant="contained"
                    color="primary"
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ]



    const columnsWarehouse = [
        {
            title: 'ID',
            field: 'id'
        },
        {
            title: 'Driver ID',
            field: 'driverId'
        },
        // { title: 'Start Execute Stamp', field: 'startExecuteStamp' },
        // { title: 'End Stamp', field: 'endStamp', key: 'endStamp' },
        // { title: 'Last Updated Stamp', field: 'lastUpdatedStamp' },
        // { title: 'Created Stamp', field: 'createdStamp' },
        {
            title: 'Route Status',
            field: 'routeStatusId',
            render: (rowData) => routeStatusMap[rowData.routeStatusId]
        },
        {
            title: 'Start warehouse',
            field: 'startWarehouseId',
        },
        {
            title: "View",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        handleWarehouseViewClick(rowData)
                    }}
                    variant="contained"
                    color="primary"
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ]


    const columnsDropOff = [
        {
            title: 'ID',
            field: 'id'
        },
        {
            title: 'Driver ID',
            field: 'driverId'
        },
        // { title: 'Start Execute Stamp', field: 'startExecuteStamp' },
        // { title: 'End Stamp', field: 'endStamp', key: 'endStamp' },
        // { title: 'Last Updated Stamp', field: 'lastUpdatedStamp' },
        // { title: 'Created Stamp', field: 'createdStamp' },
        {
            title: 'Route Status ID',
            field: 'routeStatusId',
            render: (rowData) => routeStatusMap[rowData.routeStatusId] // Render status label using lookup
        },
        {
            title: 'Warehouse ID',
            field: 'wareHouseId'
        },
        {
            title: "View",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        handleDropOffViewClick(rowData)
                    }}
                    variant="contained"
                    color="primary"
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ]

    return (
        <div>
            <h2>Pickup Routes</h2>
            <StandardTable columns={columnsPickUp} data={pickupRoutes} options={{
                selection: false,
                pageSize: 5,
                search: true,
                sorting: true,
            }} />
            <br />
            <h2>Warehouse Routes</h2>
            <StandardTable columns={columnsWarehouse} data={warehouseRoutes} options={{
                selection: false,
                pageSize: 5,
                search: true,
                sorting: true,
            }} />
            <br />
            <h2>Dropoff Routes</h2>
            <StandardTable columns={columnsDropOff} data={dropoffRoutes} options={{
                selection: false,
                pageSize: 5,
                search: true,
                sorting: true,
            }} />
        </div>
    );
};

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(DriverRoute, SCR_ID, true);
