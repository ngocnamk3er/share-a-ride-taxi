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
import PreviewRoute from "components/modal-preview-route/PreviewRoute";
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';

const AddRequestToRoute = () => {
    const { id } = useParams();
    const { routeId } = useParams();
    const [allListRequest, setAllListRequest] = useState([]);
    const [availablelistRequest, setAvailabletListRequest] = useState([]);
    const [selectedDraggble, setSelectedDraggble] = useState();
    const [showPickupModal, setShowPickupModal] = useState(false);
    const [showPreviewRoute, setShowPreviewRoute] = useState(false);
    const [assignedRequests, setAssignedRequests] = useState([]);
    const [assignedRequestsOfThisRoute, setAssignedRequestsOfThisRoute] = useState([]);
    const [changed, setChanged] = useState(false);
    const [newStateColumns, setNewStateColumns] = useState([]);
    const [historyColumns, setHistoryColumns] = useState([]);
    const [futureColumns, setFutureColumns] = useState([]);
    const [index, setIndex] = useState(-1);
    const history = useHistory();
    let { path } = useRouteMatch();
    const RECEIVED = 'RECEIVED';

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

    const undo = () => {
        if (historyColumns.length === 0) {
            return;
        }

        setFutureColumns((prev) => [columns, ...prev])

        const history = historyColumns[historyColumns.length - 1]
        setColumns(history)
        setHistoryColumns(historyColumns.slice(0, historyColumns.length - 1))
        console.log("undo")
    }

    const redo = () => {
        if (futureColumns.length === 0) {
            return;
        }

        setHistoryColumns((prev) => [...prev, columns])
        const future = futureColumns[0]
        setColumns(future);
        setFutureColumns(futureColumns.slice(1, futureColumns.length))

        console.log("redo");
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resPassengerRequest = await request("get", `/passenger-requests`);
                const resRouteDetail = await request("get", `/route-details/search?routeId=${routeId}`);

                // Tạo các biến trung gian để lưu kết quả
                const allListRequestTemp = [];
                const availableListRequestTemp = [];
                const assignedRequestsTemp = [];
                const assignedRequestsOfThisRouteTemp = [];

                // Lặp qua kết quả từ resPassengerRequest
                resPassengerRequest.data.forEach(req => {
                    allListRequestTemp.push(req);
                    if (req.statusId === 1) {
                        availableListRequestTemp.push(req);
                    } else {
                        assignedRequestsTemp.push(req);
                        // Lặp qua kết quả từ resRouteDetail để tìm các yêu cầu được gán cho tuyến đường này
                        resRouteDetail.data.forEach(element => {
                            if (element.requestId === req.requestId) {
                                assignedRequestsOfThisRouteTemp.push(req);
                            }
                        });
                    }
                });

                // Sau khi lặp xong, setState với các biến trung gian
                setAllListRequest(allListRequestTemp);
                setAvailabletListRequest(availableListRequestTemp);
                setAssignedRequests(assignedRequestsTemp);
                setAssignedRequestsOfThisRoute(assignedRequestsOfThisRouteTemp);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [routeId]); // Thêm routeId vào dependency array để useEffect được kích hoạt khi routeId thay đổi

    useEffect(() => {
        console.log('index', index)
    }, [index])

    // useEffect(() => {
    //     if (newStateColumns.length !== 0) {
    //         setIndex(prev => prev + 1)
    //     }
    // }, [newStateColumns])


    useEffect(() => {
        console.log("historyColumns")
        console.log(historyColumns)
    }, [historyColumns])

    useEffect(() => {
        console.log("futureColumns")
        console.log(futureColumns)
    }, [futureColumns])

    useEffect(() => {
        if (columns['column1']['taskIds'].length === 0 || columns['column2']['taskIds'].length === 0)
            return
        setNewStateColumns(prev => [...prev, columns])
    }, [columns])

    useEffect(() => {
        setColumns(prevColumns => {
            const newColumn1 = {
                ...prevColumns['column1'],
                taskIds: availablelistRequest.map(request => request.requestId)
            };
            const newColumn2 = {
                ...prevColumns['column2'],
                taskIds: assignedRequestsOfThisRoute.map(request => request.requestId)
            };
            return {
                ...prevColumns,
                'column1': newColumn1,
                'column2': newColumn2
            };
        });
    }, [assignedRequestsOfThisRoute, availablelistRequest]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.ctrlKey && event.key === 'z') {
                undo();
            } else if (event.ctrlKey && event.key === 'y') {
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const onDragEnd = result => {
        setChanged(true)
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

            setColumns(prevColumns => {
                setHistoryColumns(prev => [...prev, prevColumns])
                const updatedColumns = {
                    ...prevColumns,
                    [newColumn.id]: newColumn
                };
                return updatedColumns;
            });
            setFutureColumns([])
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
        setColumns(prevColumns => {
            setHistoryColumns(prev => [...prev, prevColumns])
            const updatedColumns = {
                ...prevColumns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish
            };
            return updatedColumns;
        });
        setFutureColumns([])
    };

    const handleDraggableClick = (request) => {
        // alert('Draggable click');
        setSelectedDraggble(request.requestId)
        setShowPickupModal(true);
    };

    const handleSave = async () => {

        const assignedTaskIds = columns['column2'].taskIds;
        const assignedRequestsData = assignedTaskIds.map(taskId => allListRequest.find(request => request.requestId === taskId));
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

    const openPreviewRoute = () => {
        const assignedTaskIds = columns['column2'].taskIds;
        const assignedRequestsData = assignedTaskIds.map(taskId => allListRequest.find(request => request.requestId === taskId));
        setAssignedRequests(assignedRequestsData);
        setShowPreviewRoute(true);
    }


    useEffect(() => {
        if (historyColumns.length === 0) {
            setChanged(false);
        } else {
            setChanged(true);
        }
    }, [historyColumns])


    const loadData = () => {
        // Gọi lại useEffect để load lại dữ liệu
        request("get", `/passenger-requests`, (res) => {
            const availableListFromData = res.data.filter(item => item.requestStatus === RECEIVED);
            setAllListRequest(res.data);
            setAvailabletListRequest(availableListFromData);
            const newColumn1 = {
                ...columns['column1'],
                taskIds: availableListFromData.map(request => request.requestId)
            };
            setColumns({
                ...columns,
                'column1': newColumn1
            });
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button onClick={undo} className="save-button" style={{ backgroundColor: 'orange', color: 'white' }}>
                    <UndoIcon /> Undo
                </Button>
                <Button onClick={redo} className="save-button" style={{ backgroundColor: 'orange', color: 'white' }}>
                    Redo <RedoIcon />
                </Button>
                <Button onClick={openPreviewRoute} className="save-button" style={{ backgroundColor: 'green', color: 'white' }}>
                    <PreviewIcon /> Preview route
                </Button>
                <Button onClick={handleSave} className="save-button" style={{ backgroundColor: 'blue', color: 'white' }}>
                    <SaveIcon /> Save
                </Button>
            </div>

            <Grid style={{ width: '100%' }} container spacing={2}>
                <DragDropContext onDragEnd={onDragEnd}>
                    {Object.values(columns).map(column => {
                        const listTasks = column.taskIds.map(taskId => allListRequest.find(request => request.requestId === taskId));

                        return (
                            <Grid item xs={6} key={column.id} className="column">
                                <h2>{!changed ? column.title : `${column.title} *`}</h2>
                                <Droppable droppableId={column.id}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className="task-list"
                                            style={{ height: '100%' }}
                                        >
                                            {listTasks.map((request, index) => (
                                                <div>
                                                    <Draggable key={request.requestId} draggableId={request.requestId} index={index}>
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
                                                        selectedDraggble === request.requestId &&
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
                            </Grid>
                        );
                    })}
                </DragDropContext>
            </Grid>
            <br />

            <Modal
                open={showPreviewRoute}
                onClose={() => setShowPreviewRoute(false)}
            >
                <PreviewRoute assignedRequests={assignedRequests} />
            </Modal>

        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(AddRequestToRoute, SCR_ID, true);
