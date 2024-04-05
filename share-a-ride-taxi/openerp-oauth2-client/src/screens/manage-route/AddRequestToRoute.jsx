import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import './AddRequestToRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Typography, Grid, TextField, Button, Box, Modal } from "@mui/material";
import ModalDetailPassengerRequest from "components/modal-detail-request/ModalDetailPassengerRequest";
import { useRouteMatch } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const AddRequestToRoute = () => {
    const { id } = useParams();
    const { routeId } = useParams();
    const [allListRequest, setAllListRequest] = useState([]);
    const [availablelistRequest, setAvailabletListRequest] = useState([]);
    const [selectedDraggble, setSelectedDraggble] = useState();
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [assignedRequests, setAssignedRequests] = useState([]);
    const history = useHistory();
    let { path } = useRouteMatch();
    const [columns, setColumns] = useState({
        'column1': {
            id: 'column1',
            title: 'Available passenger requests',
            taskIds: []
        },
        'column2': {
            id: 'column2',
            title: 'Assigned passenger requests',
            taskIds: []
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {


                const res = await request("get", `/passenger-requests`);
                const availableListFromData = res.data.filter(item => item.statusId === 1);
                const assignedRequestsData = res.data.filter(item => item.statusId === 2);
                const assignedRequestsDataSorted = []

                const resRouteDetail = await request("get", `/route-details/search?routeId=${routeId}`)

                const currentRoute = resRouteDetail !== undefined ? resRouteDetail.data : []
                currentRoute.forEach((routeDetail, indexRouteDetail) => {
                    assignedRequestsData.forEach((requestElement, indexReq) => {
                        if (requestElement.id === routeDetail.requestId) {
                            assignedRequestsDataSorted.push(requestElement);
                        }
                    });
                });

                console.log(assignedRequestsData)

                setAllListRequest(res.data);
                setAvailabletListRequest(availableListFromData);
                const newColumn1 = {
                    ...columns['column1'],
                    taskIds: availableListFromData.map(request => request.id)
                };
                const newColumn2 = {
                    ...columns['column2'],
                    taskIds: assignedRequestsDataSorted.map(request => request.id)
                };
                setColumns({
                    ...columns,
                    'column1': newColumn1,
                    'column2': newColumn2
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [id]);


    const onDragEnd = result => {
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
        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);
            const newColumn = {
                ...start,
                taskIds: newTaskIds
            };
            setColumns({
                ...columns,
                [newColumn.id]: newColumn
            });
            return;
        }
        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index, 1);
        const newStart = {
            ...start,
            taskIds: startTaskIds
        };
        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            taskIds: finishTaskIds
        };
        setColumns({
            ...columns,
            [newStart.id]: newStart,
            [newFinish.id]: newFinish
        });
    };

    const handleDraggableClick = (request) => {
        // alert('Draggable click');
        setSelectedDraggble(request.id)
        setShowPickupModal(true);
    };

    const handleSave = async () => {

        const assignedTaskIds = columns['column2'].taskIds;
        const assignedRequestsData = assignedTaskIds.map(taskId => allListRequest.find(request => request.id === taskId));
        setAssignedRequests(assignedRequestsData);
        const listRouteDetails = assignedRequestsData.map((item, index) => {
            return {
                requestType: "passenger",
                requestId: item.id,
                seqIndex: index + 1
            }
        })

        console.log(listRouteDetails)

        try {
            const response = await request(
                "post",
                `/routes/${routeId}/route-details`,
                (response) => {
                    console.log("Passenger request created successfully:", response.data);
                    // loadData();
                },
                {
                    400: (error) => {
                        console.error("Error creating passenger request:", error);
                    }
                },
                listRouteDetails
            );

            const currentPath = history.location.pathname; // Lấy đường dẫn hiện tại
            const newPath = currentPath.replace('/addrequests', ''); // Loại bỏ '/addrequests' từ currentPath
            history.push(newPath); // Chuyển hướng đến đường dẫn mới
        } catch (error) {
            console.error("Error creating passenger request:", error);
        }

    };

    const loadData = () => {
        // Gọi lại useEffect để load lại dữ liệu
        request("get", `/passenger-requests`, (res) => {
            const availableListFromData = res.data.filter(item => item.statusId === 1);
            setAllListRequest(res.data);
            setAvailabletListRequest(availableListFromData);
            const newColumn1 = {
                ...columns['column1'],
                taskIds: availableListFromData.map(request => request.id)
            };
            setColumns({
                ...columns,
                'column1': newColumn1
            });
        });
    };

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.values(columns).map(column => {
                    const listTasks = column.taskIds.map(taskId => allListRequest.find(request => request.id === taskId));

                    return (
                        <div key={column.id} className="column">
                            <h2>{column.title}</h2>
                            <Droppable droppableId={column.id}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="task-list"
                                    >
                                        {listTasks.map((request, index) => (
                                            <div>
                                                <Draggable key={request.id} draggableId={request.id} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="task"
                                                            onClick={() => handleDraggableClick(request)}
                                                        >
                                                            Yêu cầu của khách : {request.passengerName}
                                                        </div>
                                                    )}
                                                </Draggable>
                                                {
                                                    selectedDraggble === request.id &&
                                                    <Modal
                                                        open={showPickupModal}
                                                        onClose={() => setShowPickupModal(false)}
                                                    // aria-labelledby="modal-modal-title"
                                                    // aria-describedby="modal-modal-description"
                                                    >
                                                        <div>
                                                            <ModalDetailPassengerRequest request={request} />
                                                        </div>
                                                    </Modal>

                                                }
                                            </div>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </DragDropContext>
            <br />
            <Button onClick={handleSave} className="save-button" style={{ backgroundColor: 'blue', color: 'white' }}>Save</Button>


        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(AddRequestToRoute, SCR_ID, true);
