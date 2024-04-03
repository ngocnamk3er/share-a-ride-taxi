import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import './AddRequestToRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../api";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Typography, Grid, TextField, Button, Box, Modal } from "@mui/material";
import ModalDetailPassengerRequest from "components/modal-detail-request/ModalDetailPassengerRequest";
import RouteMap from '../../components/route-map/RouteMapp';


const DetailRoute = () => {
    const { routeId } = useParams();
    const currentPassengerRequest = []
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRouteDetail = await request("get", `/route-details/search?routeId=${routeId}`)
                const routeDetail = resRouteDetail.data
                const resPassengerRequest = await request("get", `/passenger-requests`)
                const passengerRequest = resPassengerRequest.data
                for (let j = 0; j < routeDetail.length; j++) {
                    console.log(passengerRequest)
                    for (let i = 0; i < passengerRequest.length; i++) {
                        if (routeDetail[j].requestId === passengerRequest[i].id) {
                            currentPassengerRequest.push(passengerRequest[i]);
                        }
                    }
                }

                console.log(JSON.stringify(currentPassengerRequest));

            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
    }, [routeId]);
    return (
        <div>
            <RouteMap data={currentPassengerRequest} />
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailRoute, SCR_ID, true);


