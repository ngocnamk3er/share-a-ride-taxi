import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { TextField } from "@mui/material";
import { Grid } from "@mui/material";
import { IconButton } from "@mui/material";
import { Chip } from "@mui/material";
import { useRouteMatch } from "react-router-dom";
import { request } from "../../api";
import { CircularProgress } from "@mui/material";
import WarehouseRoute from "../../components/route/warehouse-route/WarehouseRoute"
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { routeStatusMap } from "config/statusMap";
import { getStatusColor } from "config/statusMap";
import { routeStatusMapReverse } from "config/statusMap";


const DetailWarehouseRoute = (props) => {
    const { isDriver } = props;
    const [routeWarehouse, setRouteWarehouse] = useState(null);
    const [driver, setDriver] = useState(null);
    const [startWarehouse, setStartWarehouse] = useState(null);
    const [dropOffWarehouses, setDropOffWarehouses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const match = useRouteMatch();
    const { id } = match.params;
    const [selectedStatus, setSelectedStatus] = useState('');

    const columnsWareHouse = [
        {
            title: "Warehouse Name",
            field: "warehouseName",
        },
        {
            title: "View",
            sorting: false,
            cellStyle: { width: '10px', padding: '0px', textAlign: 'center' },
            headerStyle: { width: '10px', padding: '0px', textAlign: 'center' },
            render: (rowData) => (
                <IconButton
                    style={{
                        width: 50,
                    }}
                    onClick={() => {
                        // handleViewClick(rowData);
                    }}
                    variant="contained"
                    color="primary"
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
        {
            title: "Done",
            field: "visited",
            render: rowData => (
                <IconButton
                    onClick={() => handleActivateClick(rowData)}
                    color={rowData.visited ? 'primary' : 'text.disabled'}
                >
                    <CheckCircleIcon />
                </IconButton>
            )
        }
    ];



    const handleActivateClick = async (rowData) => {
        if (isDriver && routeWarehouse.routeStatusId === routeStatusMapReverse.IN_TRANSIT) {
            console.log("handleActivateClick ")
            try {
                // Gọi API để cập nhật trạng thái visited
                const response = await request('put', `/route-warehouse-details/update-visited?id=${rowData.id}&visited=${!rowData.visited}`);

                // Cập nhật lại danh sách dropOffWarehouses sau khi thay đổi
                const updatedDropOffWarehouses = dropOffWarehouses.map(warehouse => {
                    if (warehouse.id === rowData.id) {
                        return { ...warehouse, visited: !warehouse.visited };
                    }
                    return warehouse;
                });

                setDropOffWarehouses(updatedDropOffWarehouses);
            } catch (error) {
                setError(error);
            }
        }
    };

    const handleStatusChange = async (status) => {
        try {
            const response = await request('put', `/route-warehouses/${id}/status?statusId=${status}`);
            setRouteWarehouse(response.data);
        } catch (error) {
            setError(error);
        }
    };

    useEffect(() => {
        fetchRouteWarehouse();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (routeWarehouse) {
            console.log("check routeWarehouse : ", routeWarehouse)
            fetchDriver();
            fetchStartWarehouse()
            fetchDropOffWarehouses();
        }
    }, [routeWarehouse])

    const fetchRouteWarehouse = async () => {
        try {
            const response = await request('get', `/route-warehouses/${id}`);
            setRouteWarehouse(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStartWarehouse = async () => {
        try {
            const response = await request('get', `/warehouses/${routeWarehouse.startWarehouseId}`);
            setStartWarehouse(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchDriver = async () => {
        try {
            const response = await request('get', `/drivers/user/${routeWarehouse.driverId}`);
            setDriver(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    const fetchDropOffWarehouses = async () => {
        try {
            const response = await request('get', `/warehouses/by-warehouse-route/${id}`);
            setDropOffWarehouses(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (driver && startWarehouse && dropOffWarehouses) {
            console.log("check all")
            console.log(driver)
            console.log(startWarehouse)
            console.log(dropOffWarehouses)
        }
    }, [driver, startWarehouse, dropOffWarehouses])

    if (loading) return <CircularProgress />;
    if (!(driver && startWarehouse && dropOffWarehouses)) return <CircularProgress />;
    if (error) return <div>Error loading data: {error.message}</div>;

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <h1>Route {id} Details</h1>
                {routeWarehouse && (
                    <>
                        <Chip
                            label={routeStatusMap[routeWarehouse.routeStatusId]}
                            style={{
                                marginLeft: '20px',
                                backgroundColor: getStatusColor(routeWarehouse.routeStatusId),
                                color: 'white'
                            }}
                        />
                        {routeWarehouse.routeStatusId === routeStatusMapReverse.NotReady && !isDriver && <Chip
                            onClick={() => handleStatusChange(routeStatusMapReverse.Ready)}
                            label="Mark as Ready"
                            style={{
                                marginLeft: '20px',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                        />}
                        {routeWarehouse.routeStatusId === routeStatusMapReverse.Ready && isDriver && <Chip
                            onClick={() => handleStatusChange(routeStatusMapReverse.IN_TRANSIT)}
                            label="Start"
                            style={{
                                marginLeft: '20px',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                        />}
                        {routeWarehouse.routeStatusId === routeStatusMapReverse.IN_TRANSIT && isDriver && <Chip
                            onClick={() => handleStatusChange(routeStatusMapReverse.Complete)}
                            label="Mark as Complete"
                            style={{
                                marginLeft: '20px',
                                backgroundColor: 'green',
                                color: 'white'
                            }}
                        />}
                    </>

                )}
            </div>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    <WarehouseRoute style={{ width: "100%", height: "80vh" }}
                        driver={driver}
                        startWarehouse={startWarehouse}
                        listLocation={dropOffWarehouses}
                    />
                </Grid>
                <Grid item xs={4}>
                    <StandardTable
                        columns={columnsWareHouse}
                        data={dropOffWarehouses}
                        style={{
                            width: "100%",
                            height: "100%",
                            marginTop: "-40px",
                            marginBottom: "20px",
                            overflowY: "scroll",
                            overflowX: "hidden"
                        }}
                        options={{
                            selection: false,
                            pageSize: 5,
                            search: true,
                            sorting: true,
                        }}
                    />
                </Grid>
            </Grid>
            <br />
            {WarehouseRoute && (
                <div>
                    <TextField
                        label="Start warehouse id"
                        value={routeWarehouse.startWarehouseId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Driver ID"
                        value={routeWarehouse.driverId}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Start Execute Time"
                        value={routeWarehouse.startExecuteStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="End Time"
                        value={routeWarehouse.endStamp}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Route Status ID"
                        value={routeStatusMap[routeWarehouse.routeStatusId]}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                </div>
            )}
        </div>
    );
};

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(DetailWarehouseRoute, SCR_ID, true);
