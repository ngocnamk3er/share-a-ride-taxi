import React, { useState, useEffect } from "react";
import { Typography, CircularProgress, Grid, TextField, Button, Modal } from "@mui/material";
import SearchLocation from '../../components/searchLocation/SearchLocation';
import { request } from "../../api";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useHistory, useParams } from "react-router-dom";

const UpdatePassengerRequest = () => {
    return (
        <div>
            UpdatePassengerRequest
        </div>
    );
}

const SCR_ID = "SCR_SAR_UPDATE_PASSENGER_REQUEST";
export default withScreenSecurity(UpdatePassengerRequest, SCR_ID, true);
