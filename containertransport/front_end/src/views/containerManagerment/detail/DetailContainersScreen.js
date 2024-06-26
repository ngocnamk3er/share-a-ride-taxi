import React, { useContext, useEffect, useState } from "react";
import '../styles.scss';
import { Alert, Box, Button, Container, Divider, Icon, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { menuIconMap } from "config/menuconfig";
import { deleteContainer, getContainerById } from "api/ContainerAPI";
import ModalContainer from "../modal/ModalContainer";

const DetailContainerScreen = () => {

    const history = useHistory();
    const { containerId } = useParams();

    const [toastOpen, setToast] = useState(false);
    const [toastType, setToastType] = useState();
    const [toastMsg, setToastMsg] = useState('');

    const [container, setContainer] = useState('');

    const [open, setOpen] = useState(false);


    useEffect(() => {
        getContainerById(containerId).then((res) => {
            setContainer(res?.data);
        })
    }, [open]);
    const handleClose = () => {
        setOpen(!open);
    }
    const handleDelete = () => {
        deleteContainer(containerId).then((res) => {
            console.log(res);
            setToastMsg("Delete Container Success !!!");
            setToastType("success");
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, "3000");
            history.push('/container');
        })
    }
    console.log("container", container)
    return (
        <Box className="fullScreen">
            <Container maxWidth="xl" className="container">
                <Box className="toast">
                    {toastOpen ? (
                        <Alert variant="filled" severity={toastType} >
                            <strong>{toastMsg}</strong >
                        </Alert >) : null}
                </Box>

                <Box className="header-detail">
                    <Box className="headerScreen-go-back"
                        onClick={() => {
                            // history.push('/container')
                            history.goBack()
                        }}
                        sx={{ cursor: "pointer" }}
                    >
                        <Icon>
                            {menuIconMap.get("ArrowBackIosIcon")}
                        </Icon>
                        <Typography>Go back containers screen</Typography>
                    </Box>
                    <Box className="headerScreen-detail-info">
                        <Box className="title-header">
                            <Typography >Container {container?.containerCode}</Typography>
                        </Box>
                        <Box className="btn-header">
                            {container?.status === "AVAILABLE" ? (
                                <>
                                    <Button variant="outlined" color="error" className="header-create-shipment-btn-cancel"
                                        onClick={handleDelete}
                                    >Delete</Button>
                                    <Button variant="contained" className="header-submit-shipment-btn-save"
                                        onClick={handleClose}
                                    >Modify</Button>
                                </>
                            ) : null}
                        </Box>
                    </Box>
                </Box>

                <Box className="divider">
                    <Divider />
                </Box>

                <Box className="facility-info">
                    <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Container Code:</Typography>
                        </Box>
                        <Typography>{container?.containerCode}</Typography>
                    </Box>
                    <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Facility:</Typography>
                        </Box>
                        <Typography>{container?.facilityResponsiveDTO?.facilityCode}</Typography>
                    </Box>
                    <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Facility Name:</Typography>
                        </Box>
                        <Typography>{container?.facilityResponsiveDTO?.facilityName}</Typography>
                    </Box>
                    <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Facility Address:</Typography>
                        </Box>
                        <Typography>{container?.facilityResponsiveDTO?.address}</Typography>
                    </Box>
                    <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Size:</Typography>
                        </Box>
                        <Typography>{container?.size}</Typography>
                    </Box>
                    <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Status:</Typography>
                        </Box>
                        <Typography>{container?.status}</Typography>
                    </Box>
                    {/* <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Empty:</Typography>
                        </Box>
                        <Typography>{container?.isEmpty ? "True" : "False"}</Typography>
                    </Box> */}
                    <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Create At:</Typography>
                        </Box>
                        <Typography>{new Date(container?.createdAt).toLocaleString()}</Typography>
                    </Box>
                    <Box className="facility-info-item">
                        <Box className="facility-info-item-text">
                            <Typography>Update At:</Typography>
                        </Box>
                        <Typography>{new Date(container?.updatedAt).toLocaleString()}</Typography>
                    </Box>
                </Box>

                {open ? (<ModalContainer open={open} handleClose={handleClose} container={container}
                    setToast={setToast} setToastType={setToastType} setToastMsg={setToastMsg} />) : null}
            </Container>
        </Box>
    )
}
export default DetailContainerScreen;