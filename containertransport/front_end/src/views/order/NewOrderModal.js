import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Autocomplete, Divider, Switch, Alert, AlertTitle } from "@mui/material";
import PrimaryButton from "components/button/PrimaryButton";
import TertiaryButton from "components/button/TertiaryButton";
import CustomizedDialogs from "components/dialog/CustomizedDialogs";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AnimatePresence, motion } from "framer-motion";
import { grey } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { request } from "api";
import './styles.scss';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { getFacility, getFacilityOwner } from "api/FacilityAPI";
import { getContainerById, getContainers } from "api/ContainerAPI";
import dayjs from "dayjs";
import { updateOrder, updateOrderV2 } from "api/OrderAPI";


const styles = {
    backButton: {
        width: 40,
        height: 40,
        position: "absolute",
        top: 8 * 1.5,
        left: 16,
        color: "rgba(0, 0, 0, 0.5)",
        background: grey[300],
        "&:hover": {
            background: grey[400],
        },
    },
    avatarIcon: {
        width: 60,
        height: 60,
        backgroundColor: grey[300],
        margin: "8px 12px 8px 0px",
    },
    list: {
        paddingTop: 0.5,
        paddingBottom: 0,
    },
    listItem: {
        borderRadius: 2,
        padding: "0 8px",
        "&:hover": {
            background: grey[100],
        },
    },
    listItemTextPrimary: {
        fontWeight: 500,
        fontSize: 17,
    },
    btn: { margin: "4px 8px" },
};

const NewOrderModal = ({ open, setOpen, setToast, setToastType, setToastMsg, order }) => {
    const [type, setType] = useState('');
    const [facilities, setFacilities] = useState([]);
    const [ownerFacilities, setOwnerFacilities] = useState([]);
    const [portFacilities, setPortFacilities] = useState([]);
    const [fromFacilities, setFromFacilities] = useState([]);
    const [toFacilities, setToFacilities] = useState([]);
    const [fromFacility, setFromFacility] = useState('');
    const [toFacility, setToFaciity] = useState('');
    const [containers, setContainers] = useState([]);
    const [containerSelect, setContainerSelect] = useState([]);
    const [containerOrder, setContainerOrder] = useState([]);
    const [earlyDeliveryTime, setEarlyDeliveryTime] = useState();
    const [lateDeliveryTime, setLateDeliveryTime] = useState(null);
    const [earlyPickUpTime, setEarlyPickUpTime] = useState();
    const [latePickUpTime, setLatePickUpTime] = useState(null);
    const [isBreakRomooc, setIsBreakRomooc] = useState(false);
    const [weight, setWeight] = useState();
    const [facilitiesAdmin, setFacilitiesAdmin] = useState([]);

    useEffect(() => {

        getFacility({ typeOwner: ["CUSTOMER", "CUSTOMS"] }).then((res) => {
            console.log("facility==========", res?.data)
            setFacilities(res?.data.data.facilityModels);
        });
        getFacility({ typeOwner: ["CUSTOMS"] }).then((res) => {
            console.log("facility==========", res?.data)
            setPortFacilities(res?.data.data.facilityModels);
        });
        getFacilityOwner({}).then((res) => {
            setOwnerFacilities(res?.data.data.facilityModels);
        });
        getFacility({ typeOwner: ["ADMIN"], type: "Container" }).then((res) => {
            console.log("facility==========", res?.data)
            setFacilitiesAdmin(res?.data.data.facilityModels);
        });
        if (order) {

            let typeTmp = typeConst.find((item) => item.id === order.type);
            setType(typeTmp.id);
            getContainerById(order.containerModel.uid).then((res) => {
                console.log("order====", res?.data);
                let containerSelectTmp = [];
                containerSelectTmp.push(res?.data);
                setContainerOrder(containerSelectTmp);
            });


            setFromFacility(order?.fromFacility.facilityUid);
            setToFaciity(order?.toFacility.facilityUid)
            setIsBreakRomooc(order.breakRomooc);
            // setEarlyPickUpTime(dayjs(new Date(order?.earlyPickupTime)));
            if (order.latePickupTime) {
                setLatePickUpTime(dayjs(new Date(order?.latePickupTime)));
            }
            if (order.lateDeliveryTime) {
                setLateDeliveryTime(dayjs(new Date(order?.lateDeliveryTime)));
            }
            // setEarlyDeliveryTime(dayjs(new Date(order?.earlyDeliveryTime)));
        }


    }, []);

    useEffect(() => {

        if (type === "OE") {
            setToFacilities(ownerFacilities);
            setFromFacilities(facilitiesAdmin);
        }
        if (type === "IE") {
            setFromFacilities(ownerFacilities);
            setToFacilities(facilitiesAdmin);
        }
        if (type === "IF") {
            setFromFacilities(portFacilities);
            setToFacilities(ownerFacilities);
        }
        if (type === "OF") {
            setFromFacilities(ownerFacilities);
            setToFacilities(facilities);
        }
    }, [type, ownerFacilities, facilities, portFacilities])

    useEffect(() => {
        let data = {
            facilityId: fromFacility,
             status: "AVAILABLE"
        }
        if(type === "IF") {
            data["type"] = "Order";
        }
        getContainers(data).then((res) => {
            console.log("container==========", res?.data)
            setContainers(res?.data.data.containerModels);
        });
    }, [fromFacility]);

    const typeConst = [
        { name: "Inbound Empty", id: "IE" },
        { name: "Inbound Full", id: "IF" },
        { name: "Outbound Empty", id: "OE" },
        { name: "Outbound Full", id: "OF" }
    ];
    const sizeContainer = [
        { name: "20", id: 20 },
        { name: "40", id: 40 }
    ];
    const typeFull = ["IF", "IE", "OF"];

    const handleClose = () => {
        setOpen(false);
    }
    const handleChangeBreakRomooc = (e) => {
        console.log("check", e.target.checked)
        setIsBreakRomooc(e.target.checked);
    }
    const handleSubmit = () => {
        const data = {
            type: type,
            fromFacilityId: fromFacility,
            toFacilityId: toFacility,
            // earlyDeliveryTime: (new Date(earlyDeliveryTime)).getTime(),
            lateDeliveryTime: (new Date(lateDeliveryTime)).getTime(),
            // earlyPickupTime: (new Date(earlyPickUpTime)).getTime(),
            latePickupTime: (new Date(latePickUpTime)).getTime(),
            isBreakRomooc: isBreakRomooc,
            containerIds: containerSelect
        }
        if (type !== "IE") {
            data["lateDeliveryTime"] = (new Date(lateDeliveryTime)).getTime();
        }
        if (type !== "OE") {
            data["latePickupTime"] = (new Date(latePickUpTime)).getTime();
        }
        if (type === "OE") {
            data["weight"] = weight;
        }
        console.log("data", data);
        if (!order) {
            request(
                "post",
                `/order/create`, {}, {}, data
            ).then((res) => {
                console.log("res", res);
                if (res?.data.meta.code === 400) {
                    setToastType("error");
                    setToastMsg(res?.data.data);
                }
                if (!res) {
                    setToastType("error");
                    setToastMsg("Created order fail !!!");
                }
                if (res?.data.meta.code === 200) {
                    setToastType("success");
                    setToastMsg("Created order success !!!");
                }
                handleClose();
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, "2000");
            }).catch(err => {
                console.log("err", err);

            })
        }
        else {
            updateOrderV2(order.uid, data).then((res) => {
                console.log("res", res);
                if (!res) {
                    setToastType("error");
                    setToastMsg("Update order fail !!!");
                } else {
                    setToastType("success");
                    setToastMsg("Update order success !!!");
                }
                handleClose();
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, "2000");
            }).catch(err => {
                console.log("err", err);

            })
        }

    }
    const handleSelectContainer = (event, values) => {
        console.log("values", values);
        let containerIds = [];
        if (values.length > 0) {
            values.map((item) => containerIds.push(item.id))
        }
        setContainerSelect(containerIds);
        setContainerOrder(values);
    }
    console.log("facilitiesAdmin", facilitiesAdmin);
    console.log("order", order)
    return (
        <Box >
            <CustomizedDialogs
                open={open}
                handleClose={handleClose}
                contentTopDivider
                title={order ? "Update Order" : "New Order"}
                content={
                    <AnimatePresence>
                        <motion.div
                        >
                            <motion.div
                                animate="center"
                                transition={{
                                    opacity: { duration: 0.1 },
                                }}
                            >
                                <Box pt="7px" pb={1} pl={1} pr={1} sx={{ width: "650px" }} className="contentModal">
                                    <Box className="contentModal-item">
                                        <Box className="contentModal-item-text">
                                            <Typography>Type:</Typography>
                                        </Box>
                                        <Box className="contentModal-item-input">
                                            <FormControl>
                                                <InputLabel id="demo-simple-select-label">Type</InputLabel>
                                                <Select
                                                    value={type}
                                                    onChange={(e) => setType(e.target.value)}
                                                    label="type"
                                                    inputProps={{ 'aria-label': 'Without label' }}
                                                    disabled={order ? true : false}
                                                >
                                                    {typeConst ? (
                                                        typeConst.map((item, key) => {
                                                            return (
                                                                <MenuItem key={key} value={item.id}>{item.name}</MenuItem>
                                                            );
                                                        })
                                                    ) : null}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    {(order || (!order && type !== "OE")) ? (
                                        <Box className="contentModal-item">
                                            <Box className="contentModal-item-text">
                                                <Typography>From Facility: </Typography>
                                            </Box>
                                            <Box className="contentModal-item-input">
                                                <FormControl>
                                                    <InputLabel id="demo-simple-select-label">From facility</InputLabel>
                                                    <Select
                                                        value={fromFacility}
                                                        onChange={(e) => setFromFacility(e.target.value)}
                                                        label="from facility"
                                                        disabled={type === "OE" ? true : (order ? true : false)}
                                                    >
                                                        {fromFacilities ? (
                                                            fromFacilities.map((item) => {
                                                                return (
                                                                    <MenuItem value={item.uid}>{item.facilityName}</MenuItem>
                                                                );
                                                            })
                                                        ) : null}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                    ) : null}

                                    {(order || (!order && type !== "IE")) ? (
                                        <Box className="contentModal-item">
                                            <Box className="contentModal-item-text">
                                                <Typography>To Facility:</Typography>
                                            </Box>
                                            <Box className="contentModal-item-input">
                                                <FormControl>
                                                    <InputLabel id="demo-simple-select-label">To facility</InputLabel>
                                                    <Select
                                                        value={toFacility}
                                                        onChange={(e) => setToFaciity(e.target.value)}
                                                        label="to facility"
                                                        disabled={["IE", "OE"].includes(type) ? true : false}
                                                    >
                                                        {toFacilities ? (
                                                            toFacilities.map((item) => {
                                                                return (
                                                                    <MenuItem value={item.uid}>{item.facilityName}</MenuItem>
                                                                );
                                                            })
                                                        ) : null}
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                        </Box>
                                    ) : null}

                                    {
                                        (type === "OE") ? (
                                            <Box className="contentModal-item">
                                                <Box className="contentModal-item-text">
                                                    <Typography>Size:</Typography>
                                                </Box>
                                                <Box className="contentModal-item-input">
                                                    <FormControl>
                                                        <InputLabel id="demo-simple-select-label">Size</InputLabel>
                                                        <Select
                                                            value={weight}
                                                            onChange={(e) => setWeight(e.target.value)}
                                                            label="size"
                                                            disabled={order && type === "OE" ? true : false}
                                                        >
                                                            {sizeContainer ? (
                                                                sizeContainer.map((item) => {
                                                                    return (
                                                                        <MenuItem value={item.id}>{item.name}</MenuItem>
                                                                    );
                                                                })
                                                            ) : null}
                                                        </Select>
                                                    </FormControl>
                                                </Box>
                                            </Box>
                                        ) : null
                                    }

                                    {
                                        typeFull.includes(type) ? (<Box className="contentModal-item">
                                            <Box className="contentModal-item-text">
                                                <Typography>Containers:</Typography>
                                            </Box>
                                            <Box className="contentModal-item-input multi-select">
                                                <Autocomplete
                                                    multiple
                                                    disabled={order ? true : false}
                                                    id="tags-outlined"
                                                    size="small"
                                                    options={containers}
                                                    value={containerOrder}
                                                    getOptionLabel={(option) => option.containerCode}
                                                    // defaultValue={[containers[0]]}
                                                    onChange={handleSelectContainer}
                                                    filterSelectedOptions
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Containers"
                                                            placeholder="containers"
                                                        />
                                                    )}
                                                />
                                            </Box>
                                        </Box>) : null
                                    }
                                    {type !== "IE" ? (
                                    <Box className="contentModal-item">
                                        <Box className="contentModal-item-text">
                                            <Typography>Break Romooc:</Typography>
                                        </Box>
                                        <Box className="contentModal-item-input">
                                            <Switch
                                                value={isBreakRomooc}
                                                checked={isBreakRomooc}
                                                onChange={handleChangeBreakRomooc}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        </Box>
                                    </Box>) : null}
                                    
                                    {/* <Box className="contentModal-item">
                                        <Box className="contentModal-item-text">
                                            <Typography>Early Delivery Time:</Typography>
                                        </Box>
                                        <Box className="contentModal-item-input">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DateTimePicker']}>
                                                    <DateTimePicker label="Early Delivery Time"
                                                        value={earlyDeliveryTime}
                                                        onChange={(e) => setEarlyDeliveryTime((new Date(e)).getTime())} />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Box>
                                    </Box> */}
                                    {((order && order?.type !== "IE") || (!order && type !== "IE")) ? (
                                        <Box className="contentModal-item">
                                            <Box className="contentModal-item-text">
                                                <Typography>Late Delivery Time:</Typography>
                                            </Box>
                                            <Box className="contentModal-item-input">
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={['DateTimePicker']}>
                                                        <DateTimePicker label="Late Delivery Time"
                                                            value={lateDeliveryTime}
                                                            onChange={(e) => setLateDeliveryTime((new Date(e)).getTime())} />
                                                    </DemoContainer>
                                                </LocalizationProvider>
                                            </Box>
                                        </Box>) : null}
                                    {/* <Box className="contentModal-item">
                                        <Box className="contentModal-item-text">
                                            <Typography>Early PickUp Time:</Typography>
                                        </Box>
                                        <Box className="contentModal-item-input">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DateTimePicker']}>
                                                    <DateTimePicker label="Early PickUp Time"
                                                        value={earlyPickUpTime}
                                                        onChange={(e) => setEarlyPickUpTime((new Date(e)).getTime())} />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Box>
                                    </Box> */}
                                    {((order && order?.type !== "OE") || (!order && type !== "OE")) ? (
                                        <Box className="contentModal-item">
                                            <Box className="contentModal-item-text">
                                                <Typography>Late PickUp Time:</Typography>
                                            </Box>
                                            <Box className="contentModal-item-input">
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={['DateTimePicker']}>
                                                        <DateTimePicker label="Late PickUp Time"
                                                            value={latePickUpTime}
                                                            onChange={(e) => setLatePickUpTime((new Date(e)).getTime())} />
                                                    </DemoContainer>
                                                </LocalizationProvider>
                                            </Box>
                                        </Box>) : null}
                                    <Divider />
                                    <Box
                                        display="flex"
                                        justifyContent="flex-end"
                                        pt={2}
                                        ml={-1}
                                        mr={-1}
                                    >
                                        <TertiaryButton
                                            onClick={() => setOpen(false)}
                                            sx={styles.btn}
                                            style={{ width: 100 }}
                                        >
                                            Cancel
                                        </TertiaryButton>
                                        <PrimaryButton
                                            // disabled={
                                            //     isEmpty(feature) || isEmpty(detail) || isSubmitting
                                            // }
                                            sx={styles.btn}
                                            style={{ width: 100 }}
                                            onClick={handleSubmit}
                                        >
                                            {false ? "Đang gửi..." : "Submit"}
                                        </PrimaryButton>
                                    </Box>
                                </Box>
                            </motion.div>
                        </motion.div>
                    </AnimatePresence>
                }
                className="modalOrder"
            />

        </Box>
    )
}
export default NewOrderModal;