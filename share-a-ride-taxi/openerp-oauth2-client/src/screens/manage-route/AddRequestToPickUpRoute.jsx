import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import './AddRequestToPickUpRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { Typography, Grid, Box } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AddRequestToPickUpRoute = () => {
    const [passengerRequests, setPassengerRequests] = useState([]);
    const [parcelRequests, setParcelRequests] = useState([]);
    const { id } = useParams();

    const [columns, setColumns] = useState({
        'column1': {
            id: 'column1',
            title: 'Available passenger requests',
            taskIds: []
        },
        'column2': {
            id: 'column2',
            title: 'Assigned parcel requests',
            taskIds: []
        }
    });

    useEffect(() => {
        const fetchPassengerRequests = async () => {
            try {
                const res = await request("get", `/passenger-requests`);
                setPassengerRequests(res.data);
                const taskIds = res.data.map(request => "passenger-request "+request.requestId);
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

        const fetchParcelRequests = async () => {
            try {
                const res = await request("get", `/parcel-requests/by-pickup-route/${id}`);
                setParcelRequests(res.data);
                const taskIds = res.data.map(request => "parcel-request "+request.requestId);
                setColumns(prevColumns => ({
                    ...prevColumns,
                    'column2': {
                        ...prevColumns['column2'],
                        taskIds: taskIds
                    }
                }));
            } catch (error) {
                console.error("Error fetching parcel requests:", error);
            }
        };

        fetchPassengerRequests();
        fetchParcelRequests();
    }, [id]);

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

        if (start === finish) {
            const newTaskIds = Array.from(start.taskIds);
            newTaskIds.splice(source.index, 1);
            newTaskIds.splice(destination.index, 0, draggableId);

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
        finishTaskIds.splice(destination.index, 0, draggableId);
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

    return (
        <div>
            <Grid container spacing={2}>
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
                                                <Draggable key={taskId} draggableId={taskId} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="task"
                                                        >
                                                            {taskId}
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
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(AddRequestToPickUpRoute, SCR_ID, true);
