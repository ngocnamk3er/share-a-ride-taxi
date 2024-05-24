import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from "@mui/material/IconButton";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from 'react-router-dom';

const ParcelRouteList = () => {
    const [pickupRoutes, setPickupRoutes] = useState([]);
    const [dropoffRoutes, setDropoffRoutes] = useState([]);
    const [warehouseRoutes, setWarehouseRoutes] = useState([]);
    const history = useHistory(); // Initialize useHistory hook
    let { path } = useRouteMatch();

    const routeStatusMap = {
        0: "Not Ready",
        1: "Ready",
        2: "Start",
        3: "Complete"
    };

    useEffect(() => {
        fetchRoutes();
    }, []);



    const fetchRoutes = async () => {
        try {
            const [pickupResponse, dropoffResponse, warehouseResponse] = await Promise.all([
                request('GET', '/route-pickups'),
                request('GET', '/route-dropoffs'),
                request('GET', '/route-warehouses')
            ]);

            setPickupRoutes(pickupResponse.data);
            setDropoffRoutes(dropoffResponse.data);
            setWarehouseRoutes(warehouseResponse.data);
        } catch (error) {
            console.error("Failed to fetch routes", error);
        }
    };

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
export default withScreenSecurity(ParcelRouteList, SCR_ID, true);
