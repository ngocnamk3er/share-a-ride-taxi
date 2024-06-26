import React, { useContext, useEffect, useState } from "react";
import '../styles.scss';
import { Alert, Box, Button, Container, Divider, Icon, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { MyContext } from "contextAPI/MyContext";
import { menuIconMap, roles, typeOrderMap } from "config/menuconfig";
import { deleteOrder, getOrderByUid, updateOrderList } from "api/OrderAPI";
import NewOrderModal from "../NewOrderModal";

const OrderDetail = () => {
    const history = useHistory();
    const { uid, type } = useParams();
    const [order, setOrder] = useState();
    const { role, preferred_username } = useContext(MyContext);

    const [toastOpen, setToast] = useState(false);
    const [toastType, setToastType] = useState();
    const [toastMsg, setToastMsg] = useState('');

    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(!open);
    }

    useEffect(() => {
        getOrderByUid(uid).then((res) => {
            setOrder(res?.data.data)
        })
    }, [open])

    const handleBackScreen = () => {
        if (type === "WaitApprove") {
            history.push('/wait-approve/order')
        }
        else {
            history.push('/order')
        }
    }
    const handleCancel = () => {
        deleteOrder(uid).then((res) => {
            console.log(res);
            setToastMsg("Delete Order Success");
            setToastType("success");
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, "3000");
            if (type === "WaitApprove") {
                history.push('/wait-approve/order')
            }
            else {
                history.push('/order')
            }
        })
    }
    const handleReject = () => {
        let data = {
            status: "REJECT",
            uidList: [].concat(uid)
        }
        updateOrderList(data).then((res) => {
            history.push('/wait-approve/order')
        })
    }
    const handleApprove = () => {
        let data = {
            status: "ORDERED",
            uidList: [].concat(uid)
        }
        updateOrderList(data).then((res) => {
            history.push('/wait-approve/order')
        })
    }
    console.log("uid", uid)
    return (
        <Box className="fullScreen">
            <Container maxWidth="100vw" className="container">
                <Box className="toast">
                    {toastOpen ? (
                        <Alert variant="filled" severity={toastType} >
                            <strong>{toastMsg}</strong >
                        </Alert >) : null}
                </Box>

                <Box className="header-detail">
                    <Box className="headerScreen-go-back"
                        onClick={handleBackScreen}
                        sx={{ cursor: "pointer" }}
                    >
                        <Icon>
                            {menuIconMap.get("ArrowBackIosIcon")}
                        </Icon>
                        {type === "WaitApprove" ? (
                            <Typography>Go back orders wait approve screen</Typography>
                        ) : (
                            <Typography>Go back orders screen</Typography>
                        )}

                    </Box>
                    <Box className="headerScreen-detail-info">
                        <Box className="title-header">
                            <Typography >Order {order?.orderCode}</Typography>
                        </Box>
                        {type === "WaitApprove" ? (
                            <Box className="btn-header">
                                {role.includes(roles.get("Admin")) ? (
                                    <>
                                        <Button variant="outlined" color="error" className="header-create-shipment-btn-cancel"
                                            onClick={handleReject}
                                        >Reject</Button>
                                        <Button variant="contained" className="header-submit-shipment-btn-save"
                                            onClick={handleApprove}
                                        >Approve</Button>
                                </>
                                ) : null}
                            </Box>
                        ) : (
                            <Box className="btn-header">
                                {order?.status === "WAIT_APPROVE" ? (
                                    <>
                                        <Button variant="outlined" color="error" className="header-create-shipment-btn-cancel"
                                        onClick={handleCancel}
                                        >Delete</Button>
                                        <Button variant="contained" className="header-submit-shipment-btn-save"
                                            onClick={handleClose}
                                        >Modify</Button>
                                    </>
                                ) : null}
                            </Box>
                        )}
                    </Box>
                </Box>

                <Box className="divider">
                    <Divider />
                </Box>

                <Box className="text-head-item">Order Info:</Box>
                <Box className="order-info">
                    <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Order Code:</Typography>
                        </Box>
                        <Typography>{order?.orderCode}</Typography>
                    </Box>
                    <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Order Type:</Typography>
                        </Box>
                        <Typography>{typeOrderMap.get(order?.type)}</Typography>
                    </Box>
                    <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Order Status:</Typography>
                        </Box>
                        <Box className="text-head">
                            <Typography>{order?.status}</Typography>
                        </Box>
                    </Box>
                    <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Break Romooc:</Typography>
                        </Box>
                        <Typography>{order?.isBreakRomooc ? "True" : "False"}</Typography>
                    </Box>
                    {/* <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Early Pickup Time:</Typography>
                        </Box>
                        <Typography>{new Date(order?.earlyPickupTime).toLocaleString()}</Typography>
                    </Box> */}
                    <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Late Pickup Time:</Typography>
                        </Box>
                        <Typography>{new Date(order?.latePickupTime).toLocaleString()}</Typography>
                    </Box>
                    {/* <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Early Delivery Time:</Typography>
                        </Box>
                        <Typography>{new Date(order?.earlyDeliveryTime).toLocaleString()}</Typography>
                    </Box> */}
                    <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Late Delivery Time:</Typography>
                        </Box>
                        <Typography>{new Date(order?.lateDeliveryTime).toLocaleString()}</Typography>
                    </Box>
                </Box>

                <Box className="text-head-item">Container:</Box>
                <Box className="order-info">
                    <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Container Code:</Typography>
                        </Box>
                        <Typography>{order?.containerModel.containerCode}</Typography>
                    </Box>
                    <Box className="order-info-item">
                        <Box className="text-head">
                            <Typography>Container Size:</Typography>
                        </Box>
                        <Typography>{order?.containerModel.size}</Typography>
                    </Box>
                </Box>

                <Box className="text-head-item">Transport:</Box>
                <Box className="order-info-transport">
                    <Box className="from-facility">
                        <Box className="text-head-facility">
                            <Typography>From Facility:</Typography>
                        </Box>
                        <Box className="order-info-item">
                            <Box className="text-head">
                                <Typography>Facility Code:</Typography>
                            </Box>
                            <Typography>{order?.fromFacility.facilityCode}</Typography>
                        </Box>
                        <Box className="order-info-item">
                            <Box className="text-head">
                                <Typography>Facility Name:</Typography>
                            </Box>
                            <Typography>{order?.fromFacility.facilityName}</Typography>
                        </Box>
                        <Box className="order-info-item">
                            <Box className="text-head">
                                <Typography>Facility Address:</Typography>
                            </Box>
                            <Typography>{order?.fromFacility.address}</Typography>
                        </Box>
                    </Box>
                    <Box className="to-facility">
                        <Box className="text-head-facility">
                            <Typography>To Facility:</Typography>
                        </Box>
                        <Box className="order-info-item">
                            <Box className="text-head">
                                <Typography>Facility Code:</Typography>
                            </Box>
                            <Typography>{order?.toFacility.facilityCode}</Typography>
                        </Box>
                        <Box className="order-info-item">
                            <Box className="text-head">
                                <Typography>Facility Name:</Typography>
                            </Box>
                            <Typography>{order?.toFacility.facilityName}</Typography>
                        </Box>
                        <Box className="order-info-item">
                            <Box className="text-head">
                                <Typography>Facility Address:</Typography>
                            </Box>
                            <Typography>{order?.toFacility.address}</Typography>
                        </Box>
                    </Box>
                </Box>

                {open ? (
                    <NewOrderModal open={open} setOpen={setOpen}
                        setToast={setToast} setToastType={setToastType} setToastMsg={setToastMsg} order={order} />
                ) : null}
            </Container>
        </Box>
    )
}
export default OrderDetail;