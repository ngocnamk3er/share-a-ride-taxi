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

const AddRequestToWarehouseRoute = () => {
    return (
        <div>
            AddRequestToWarehouseRoute
        </div>
    )
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(AddRequestToWarehouseRoute, SCR_ID, true);
