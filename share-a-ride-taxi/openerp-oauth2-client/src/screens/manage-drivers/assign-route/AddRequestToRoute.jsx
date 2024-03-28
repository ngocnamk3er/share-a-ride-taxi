import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import './AddRequestToRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../../api";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const AddRequestToRoute = () => {
    const { id } = useParams();
    const [listRequest, setListRequest] = useState([]);
    const [columns, setColumns] = useState({
        'column1': {
            id: 'column1',
            title: 'Available requests',
            taskIds: []
        },
        'column2': {
            id: 'column2',
            title: 'Assigned requests',
            taskIds: []
        }
    });

    useEffect(() => {
        request("get", `/passenger-requests`, (res) => {
            setListRequest(res.data);
            const newColumn1 = {
                ...columns['column1'],
                taskIds: res.data.map(request => request.id)
            };
            setColumns({
                ...columns,
                'column1': newColumn1
            });
        });
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

    const handleSave = () => {
        // Hàm demo có thể làm bất kỳ điều gì bạn muốn khi nút lưu được bấm
        console.log("Demo function is called!");
    };

    return (
        <div>
            <div className="save-button-container">
                <button onClick={handleSave} className="save-button">Save</button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                {Object.values(columns).map(column => {
                    const listTasks = column.taskIds.map(taskId => listRequest.find(request => request.id === taskId));

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
                                            <Draggable key={request.id} draggableId={request.id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="task"
                                                    >
                                                        Yêu cầu của khách tên : {request.passengerName}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </DragDropContext>
        </div>
    );
}

const SCR_ID = "SCR_SAR_LIST_DRIVERS";

export default withScreenSecurity(AddRequestToRoute, SCR_ID, true);
