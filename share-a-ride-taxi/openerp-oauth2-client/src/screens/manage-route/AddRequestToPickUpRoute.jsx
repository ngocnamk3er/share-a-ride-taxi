import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import './AddRequestToPickUpRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { Typography, Grid, Button, Modal } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PickUpRoute from "components/route/pickup-route/PickUpRoute";
import { useHistory } from "react-router-dom";
import DropOffRoute from "components/route/dropoff-route/DropOffRoute";
import { useRouteMatch } from 'react-router-dom';

const AddRequestToPickUpRoute = () => {
    const [unAssignedParcelRequests, setUnAssignedParcelRequests] = useState([]);
    const [unAssignedPassengerRequests, setUnAssignedPassengerRequests] = useState([]);
    const [parcelRequestsOfRoute, setParcelRequestsOfRoute] = useState([]);
    const [passengerRequestsOfRoute, setPassengerRequestsOfRoute] = useState([]);
    const [combinedRequests, setCombinedRequests] = useState(null);
    const [routePickup, setRoutePickup] = useState(null);
    const [driver, setDriver] = useState(null);
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

    const fetchRoutePickup = async () => {
        try {
            const response = await request('get', `/route-pickups/${id}`);
            setRoutePickup(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const fetchPassengerRequests = async () => {
        try {
            const res = await request("get", `/passenger-requests`);

            const filteredRequests = res.data.filter(request => request.statusId === 0);

            setUnAssignedPassengerRequests(filteredRequests);

            // const taskIds = res.data.map(request => "passenger-request "+request.requestId);
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
                // Các thuộc tính khác của request bạn muốn bổ sung vào object
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
            // Gọi API để lấy parcel requests
            const resParcelReq = await request("get", `/parcel-requests/by-pickup-route/${id}`);
            setParcelRequestsOfRoute(resParcelReq.data);

            // Gọi API để lấy passenger requests
            const resPassengerReq = await request("get", `/passenger-requests/get-by-route-id/${id}`);
            setPassengerRequestsOfRoute(resPassengerReq.data);

            // Kết hợp taskIds của parcel requests và passenger requests
            const parcelTaskIds = resParcelReq.data.map(request => ({
                id: request.requestId,
                type: 'parcel-request',
                description: "parcel-request of " + request.senderName,
                seqIndex: request.seqIndex,
                pickupLatitude: request.pickupLatitude,
                pickupLongitude: request.pickupLongitude,
                pickupAddress: request.pickupAddress
            }));

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

            // Kết hợp cả hai loại taskIds
            const combinedTaskIds = [...parcelTaskIds, ...passengerTaskIds];
            combinedTaskIds.sort((a, b) => a.seqIndex - b.seqIndex);

            setColumns(prevColumns => ({
                ...prevColumns,
                'column2': {
                    ...prevColumns['column2'],
                    taskIds: combinedTaskIds
                }
            }));
        } catch (error) {
            console.error("Error fetching requests:", error);
        }
    };

    useEffect(() => {
        fetchPassengerRequests();
        fetchRequestsOfRoute();
        fetchRoutePickup();
    }, [id]);


    useEffect(() => {
        if (routePickup) {
            fetchDriver(routePickup.driverId);
            fetchWarehouse(routePickup.wareHouseId);
        }
    }, [routePickup]);

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

        // Chuyển chuỗi draggableId thành đối tượng
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
        const assignedParcelRequests = [];

        columns['column2'].taskIds.forEach((taskId, index) => {
            if (taskId.type === 'passenger-request') {
                assignedPassengerRequests.push({
                    requestId: taskId.id,
                    routeId: id,
                    seqIndex: index + 1, // Cần xem xét cách tính seqIndex
                    routeType: "PICK_UP_ROUTE",
                    // Các thuộc tính khác của passenger request bạn muốn gửi đi
                });
            }
        });

        columns['column2'].taskIds.forEach((taskId, index) => {
            if (taskId.type === 'parcel-request') {
                assignedParcelRequests.push({
                    routeId: id,
                    requestId: taskId.id,
                    seqIndex: index + 1 // Thay đổi cách tính seqIndex nếu cần
                });
            }
        });

        try {
            await Promise.all([
                request("put", `/passenger-requests/add-to-route/${id}`, null, null, assignedPassengerRequests),
                request("post", `/route-pickups/${id}/pick-up-route-details`, null, null, assignedParcelRequests)
            ]);
            const newPath = path.replace('/:id/add-request', `/${id}`);
            history.push(newPath);
            // Có thể hiển thị thông báo hoặc cập nhật UI tại đây nếu cần
        } catch (error) {
            console.error("Error updating route:", error);
            // Xử lý lỗi và hiển thị thông báo cho người dùng nếu cần
        }
    };

    const handlePreviewRouteClick = () => {
        const combinedRequests = generateCombinedRequests();
        setCombinedRequests(combinedRequests)
        console.log("check combinedRequests : ", combinedRequests);
    }

    const generateCombinedRequests = () => {
        return columns['column2'].taskIds.map(task => {
            if (task.type === 'parcel-request') {
                return {
                    requestId: task.id,
                    type: task.type,
                    senderName: task.description.split(' of ')[1],
                    pickupAddress: task.pickupAddress,
                    pickupLatitude: task.pickupLatitude,
                    pickupLongitude: task.pickupLongitude,
                };
            } else if (task.type === 'passenger-request') {
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
                                            // const request = column.id === 'column1' ?
                                            //     passengerRequests.find(req => req.requestId === taskId) :
                                            //     parcelRequests.find(req => req.requestId === taskId);

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
                    <PickUpRoute
                        style={{
                            width:"100%",
                            height:"100%",
                        }}
                        combinedRequests={combinedRequests}
                        driver={driver}
                        warehouse={warehouse} />
                </div>
            </Modal>
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(AddRequestToPickUpRoute, SCR_ID, true);
