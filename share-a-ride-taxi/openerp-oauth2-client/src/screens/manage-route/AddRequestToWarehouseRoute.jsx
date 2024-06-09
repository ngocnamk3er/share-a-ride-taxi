import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import './AddRequestToPickUpRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { Grid, Button, Modal } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import WarehouseRoute from "components/route/warehouse-route/WarehouseRoute";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from 'react-router-dom';

const AddRequestToWarehouseRoute = () => {
    const [unAssignedPassengerRequests, setUnAssignedPassengerRequests] = useState([]);
    const [passengerRequestsOfRoute, setPassengerRequestsOfRoute] = useState([]);
    const [combinedRequests, setCombinedRequests] = useState(null);
    const [driver, setDriver] = useState(null);
    const [routeWarehouse, setRouteWarehouse] = useState(null);
    const [warehouse, setWarehouse] = useState(null);
    const [error, setError] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    let { path } = useRouteMatch();
    const history = useHistory();
    const { id } = useParams();

    const [columns, setColumns] = useState({
        'column1': {
            id: 'column1',
            title: 'Available passenger requests',
            taskIds: []
        },
        'column2': {
            id: 'column2',
            title: 'Current Route',
            taskIds: []
        }
    });

    const fetchRouteWarehouse = async () => {
        try {
            const response = await request('get', `/route-warehouses/${id}`);
            setRouteWarehouse(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const fetchPassengerRequests = async () => {
        try {
            const res = await request("get", `/passenger-requests`);

            const filteredRequests = res.data.filter(request => request.statusId === 0);

            setUnAssignedPassengerRequests(filteredRequests);

            const taskIds = filteredRequests.map(request => ({
                id: request.requestId,
                type: 'passenger-request',
                description: "passenger-request of " + request.passengerName,
                pickupLatitude: request.pickupLatitude,
                pickupLongitude: request.pickupLongitude,
                pickupAddress: request.pickupAddress,
                dropoffLatitude: request.dropoffLatitude,
                dropoffLongitude: request.dropoffLongitude,
                dropoffAddress: request.dropoffAddress,
            }));

            setColumns(prevColumns => ({
                ...prevColumns,
                'column1': {
                    ...prevColumns['column1'],
                    taskIds: taskIds
                }
            }));
        } catch (error) {
            console.error("Error fetching passenger requests:", error);
        }
    };

    const fetchDriver = async (driverId) => {
        try {
            const response = await request('get', `/drivers/user/${driverId}`);
            setDriver(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const fetchWarehouse = async (warehouseId) => {
        try {
            const response = await request('get', `/warehouses/${warehouseId}`);
            setWarehouse(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const fetchRequestsOfRoute = async () => {
        try {
            const resPassengerReq = await request("get", `/passenger-requests/get-by-route-id/${id}`);
            setPassengerRequestsOfRoute(resPassengerReq.data);

            const passengerTaskIds = resPassengerReq.data.map(request => ({
                id: request.requestId,
                type: 'passenger-request',
                description: "passenger-request of " + request.passengerName,
                seqIndex: request.seqIndex,
                pickupLatitude: request.pickupLatitude,
                pickupLongitude: request.pickupLongitude,
                pickupAddress: request.pickupAddress,
                dropoffLatitude: request.dropoffLatitude,
                dropoffLongitude: request.dropoffLongitude,
                dropoffAddress: request.dropoffAddress
            }));

            setColumns(prevColumns => ({
                ...prevColumns,
                'column2': {
                    ...prevColumns['column2'],
                    taskIds: passengerTaskIds.sort((a, b) => a.seqIndex - b.seqIndex)
                }
            }));
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    const fetchTransitWarehouses = async () => {
        try {
            const response = await request('get', `/warehouses/by-warehouse-route/${id}`);
            const warehouses = response.data;

            const taskIds = warehouses.map(warehouse => ({
                id: warehouse.warehouseId,
                type: 'transit-warehouse',
                description: "Transit Warehouse: " + warehouse.warehouseName,
                seqIndex: warehouse.seqIndex,
                lat: warehouse.lat,
                lon: warehouse.lon,
                address: warehouse.address
            }));

            setColumns(prevColumns => ({
                ...prevColumns,
                'column2': {
                    ...prevColumns['column2'],
                    taskIds: taskIds.sort((a, b) => a.seqIndex - b.seqIndex)
                }
            }));
        } catch (error) {
            console.error("Error fetching transit warehouses:", error);
        }
    };

    useEffect(() => {
        fetchPassengerRequests();
        fetchRequestsOfRoute();
        fetchTransitWarehouses();
        fetchRouteWarehouse();
    }, [id]);

    useEffect(() => {
        if (routeWarehouse) {
            fetchDriver(routeWarehouse.driverId);
            fetchWarehouse(routeWarehouse.startWarehouseId);
        }
    }, [routeWarehouse]);

    useEffect(() => {
        if (combinedRequests) {
            setIsPreviewOpen(true);
        }
    }, [combinedRequests]);

    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId &&
            destination.index === source.index) {
            return;
        }

        const start = columns[source.droppableId];
        const finish = columns[destination.droppableId];

        const draggedItem = JSON.parse(draggableId);

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggedItem);

            const newColumn = {
                ...start,
                taskIds: newTaskIds
            };

            setColumns(prevColumns => ({
                ...prevColumns,
                [newColumn.id]: newColumn
            }));

            return;
        }

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds
        };

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggedItem);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        };

        setColumns(prevColumns => ({
            ...prevColumns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
        }));
    };

    const handleUpdateRouteClick = async () => {
        const assignedPassengerRequests = [];
        const assignedTransitWarehouses = [];

        columns['column2'].taskIds.forEach((taskId, index) => {
            if (taskId.type === 'passenger-request') {
                assignedPassengerRequests.push({
                    requestId: taskId.id,
                    routeId: id,
                    seqIndex: index + 1,
                    routeType: "WAREHOUSE_ROUTE",
                });
            } else if (taskId.type === 'transit-warehouse') {
                assignedTransitWarehouses.push({
                    warehouseId: taskId.id,
                    routeId: id,
                    visited: false, // Assuming default value
                    seqIndex: index + 1,
                    // You may need to adjust this depending on your API requirements
                });
            }
        });

        try {
            // Update assigned passenger requests
            await request("put", `/passenger-requests/add-to-route/${id}`, null, null, assignedPassengerRequests);

            // Create RouteWarehouseDetails for transit warehouses
            if (assignedTransitWarehouses.length > 0) {
                await request("post", `/route-warehouses/${id}/warehouse-route-details`, null, null, assignedTransitWarehouses);
            }

            const newPath = path.replace('/:id/add-request', `/${id}`);
            history.push(newPath);
        } catch (error) {
            console.error("Error updating route:", error);
        }
    };

    const handlePreviewRouteClick = () => {
        const combinedRequests = generateCombinedRequests();
        setCombinedRequests(combinedRequests)
        console.log("check combinedRequests : ", combinedRequests);
    }

    const generateCombinedRequests = () => {
        return columns['column2'].taskIds.map(task => {
            if (task.type === 'passenger-request') {
                return {
                    requestId: task.id,
                    type: task.type,
                    passengerName: task.description.split(' of ')[1],
                    pickupAddress: task.pickupAddress,
                    pickupLatitude: task.pickupLatitude,
                    pickupLongitude: task.pickupLongitude,
                    dropoffLatitude: task.dropoffLatitude,
                    dropoffLongitude: task.dropoffLongitude,
                    dropoffAddress: task.dropoffAddress,
                };
            } else if (task.type === 'transit-warehouse') {
                return {
                    requestId: task.id,
                    type: task.type,
                    warehouseName: task.description.split(': ')[1],
                    address: task.address,
                    lat: task.lat,
                    lon: task.lon,
                };
            }
            return null;
        }).filter(request => request !== null);
    };

    useEffect(() => {
        console.log(columns['column2'].taskIds)
    }, [columns])

    return (
        <div>
            <Grid container spacing={2}>
                <Grid item xs={12} className="update-button" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleUpdateRouteClick}>
                        Update Route
                    </Button>
                    <Button variant="contained" color="primary" onClick={handlePreviewRouteClick}>
                        Preview Route
                    </Button>
                </Grid>
                <DragDropContext onDragEnd={onDragEnd}>
                    {Object.values(columns).map(column => (
                        <Grid item xs={6} key={column.id} className="column">
                            <h2>{column.title}</h2>
                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="task-list"
                                    >
                                        {column.taskIds.map((taskId, index) => {
                                            return (
                                                <Draggable key={JSON.stringify(taskId)} draggableId={JSON.stringify(taskId)} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="task"
                                                        >
                                                            {taskId.description}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Grid>
                    ))}
                </DragDropContext>
            </Grid>
            <Modal
                open={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                aria-labelledby="preview-route-title"
                aria-describedby="preview-route-description"
            >
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
                    }}>
                    <WarehouseRoute
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                        combinedRequests={combinedRequests}
                        driver={driver}
                        startWarehouse={warehouse} />
                </div>
            </Modal>
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(AddRequestToWarehouseRoute, SCR_ID, true);
