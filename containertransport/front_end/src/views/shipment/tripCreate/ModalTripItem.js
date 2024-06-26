import { Box, Modal, Icon, Typography, Divider, TextField, Button, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import '../styles.scss';
import React, { useEffect, useState } from "react";
import { getTraler } from "api/TrailerAPI";
import { getFacility } from "api/FacilityAPI";
import { tripItemType } from "config/menuconfig";

const ModalTripItem = ({ openModal, handleModal, setAddTripItem, trailerSelect, setTrailerSelect, truckSelected }) => {
    
    const [facilities, setFacilities] = useState([]);
    const [trailers, setTrailerList] = useState([]);
    const [facility, setFacility] = useState();
    const [trailer, setTrailer] = useState();
    const [action, setAction] = useState('');
    const [type, setType] = useState('');
    const [msg, setMsg] = useState('');

    const [facilitiesTrailer, setFacilitiesTrailer] = useState([]);
    const [facilitiesTruck, setFacilitiesTruck] = useState([]);

    const actionConst = [
        { name: "PICKUP_TRAILER", id: "1" },
        { name: "DROP_TRAILER", id: "2" },
        { name: "STOP", id: "3" },
    ];
    const typeConst = [
        { name: "Trailer", id: "1" },
        { name: "Truck", id: "2" },
    ];

    useEffect(() => {
        let trailerFilter = {
            status: "AVAILABLE"
        }
        getTraler(trailerFilter).then((res) => {
            console.log("res.data.data", res?.data.data.trailerModels)
            setTrailerList(res?.data.data.trailerModels);
        })
        // xem xet lay dung facility
        getFacility({type: "Trailer"}).then((res) => {
            setFacilitiesTrailer(res?.data.data.facilityModels);
        })

        getFacility({type: "Truck"}).then((res) => {
            setFacilitiesTruck(res?.data.data.facilityModels);
        })
    }, []);

    useEffect(() => {
        if(action === "DROP_TRAILER") {
            setFacilities(facilitiesTrailer)
        }
        if(action === "STOP") {
            setFacilities(facilitiesTruck)
        }
    }, [action])

    const handleChange = (event) => {
        setFacility(event.target.value);
    };
    const handleChangeType = (event) => {
        setType(event.target.value);
    };
    const handleChangeTrailer = (event) => {
        setTrailer(event.target.value);
    };
    const handleChangeAction = (event) => {
        if(event.target.value === "PICKUP_TRAILER" || event.target.value === "DROP_TRAILER") {
            setType("Trailer");
        }
        if(event.target.value === "STOP") {
            setType("Truck");
        }
        setAction(event.target.value);
    };
    const handleSubmit = () => {
        if (type === "Truck") {
            if(!truckSelected) {
                setMsg("Can't select add STOP action while Truck is not selected")
            } else {
                let tripItem = buildTripItem(truckSelected, "E1", "Truck", facility)
                setAddTripItem(tripItem);
                handleModal();
                clearData();
            }
        }
        if (type === "Trailer") {
            let tripItem;
            if (action === "PICKUP_TRAILER") {
                tripItem =
                [{
                    // xem xet lai id co the trung
                    code: trailer?.id + "TRA1",
                    type: tripItemType.get("Trailer"),
                    facilityId: trailer?.facilityResponsiveDTO?.facilityId,
                    facilityName: trailer?.facilityResponsiveDTO?.facilityName,
                    facilityCode: trailer?.facilityResponsiveDTO?.facilityCode,
                    action: action,
                    orderCode: trailer?.trailerCode,
                    longitude: trailer?.facilityResponsiveDTO?.longitude,
                    latitude: trailer?.facilityResponsiveDTO?.latitude,
                    trailerId: trailer?.id,
                    trailerCode: trailer?.trailerCode,
                    arrivalTime: null,
                    departureTime: null
                }];
                setTrailerSelect(trailer);
            }
            if (action === "DROP_TRAILER") {
                console.log("trailerSelect", trailerSelect);
                if (!trailerSelect) {
                    setMsg("Can't select add DROP TRAILER action while Trailer is not selected before!")
                } else {
                    tripItem = buildTripItem(trailerSelect, "TRA2", "Trailer", facility);
                }
            }
            console.log("tripItem", tripItem);
            setAddTripItem(tripItem);
            handleModal();
            clearData();
        }
    }
    const buildTripItem = (obj, id, type, facilityTmp) => {
        let tripItem = [{
            code: obj?.id + id,
            type: type,
            facilityId: facilityTmp?.id,
            facilityName: facilityTmp?.facilityName,
            facilityCode: facilityTmp?.facilityCode,
            action: action,
            orderCode: type === "Truck" ? obj?.truckCode : obj?.trailerCode,
            longitude: facilityTmp?.longitude,
            latitude: facilityTmp?.latitude,
            trailerId: type === "Trailer" ? obj?.id : null,
            trailerCode: type === "Trailer" ? obj?.trailerCode : null,
            arrivalTime: null,
            departureTime: null
        }];
        return tripItem;
    }
    const handleCancel = () => {
        clearData();
        handleModal()
    }
    const clearData = () => {
        setType('');
        setMsg('');
        setAction('');
        setTrailer();
        setFacility();
    }

    return (
        <Modal
            open={openModal}
            onClose={handleModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className="modal">
                <Box className="header-modal">
                    <Typography className="header-modal-text">Add TripItem</Typography>
                </Box>
                <Divider sx={{ mb: 4, mt: 4 }} />
                <Box className="body-modal">
                    {/* <Box className="body-modal-item">
                        <Box className="body-modal-item-text">
                            <Typography>Type:</Typography>
                        </Box>
                        <Box className="body-modal-item-input">
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">type</InputLabel>
                                <Select
                                    value={type}
                                    onChange={handleChangeType}
                                    label="facility"
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {typeConst ? (
                                        typeConst.map((item, key) => {
                                            return (
                                                <MenuItem value={item.name}>{item.name}</MenuItem>
                                            );
                                        })
                                    ) : null}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box> */}
                    <Box className="body-modal-item">
                        <Box className="body-modal-item-text">
                            <Typography>Action:</Typography>
                        </Box>
                        <Box className="body-modal-item-input">
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">action</InputLabel>
                                <Select
                                    value={action}
                                    onChange={handleChangeAction}
                                    label="facility"
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {actionConst ? (
                                        actionConst.map((item, key) => {
                                            return (
                                                <MenuItem value={item.name}>{item.name}</MenuItem>
                                            );
                                        })
                                    ) : null}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                    {type && type === "Trailer" && action && action === "PICKUP_TRAILER" ? (<Box className="body-modal-item">
                        <Box className="body-modal-item-text">
                            <Typography>Trailer:</Typography>
                        </Box>
                        <Box className="body-modal-item-input">
                            <FormControl>
                                <InputLabel id="demo-simple-select-label">trailer</InputLabel>
                                <Select
                                    value={trailer}
                                    onChange={handleChangeTrailer}
                                    label="facility"
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {trailers ? (
                                        trailers.map((item, index) => {
                                            return (
                                                <MenuItem value={item}>{item?.trailerCode} - {item?.facilityResponsiveDTO.facilityCode} - {item?.facilityResponsiveDTO.facilityName}</MenuItem>
                                            );
                                        })
                                    ) : null}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>) : null}
                    {type && type === "Trailer" && action && action === "DROP_TRAILER" ? (
                        <Box className="body-modal-item">
                            <Box className="body-modal-item-text">
                                <Typography>Facility:</Typography>
                            </Box>
                            <Box className="body-modal-item-input">
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">facility</InputLabel>
                                    <Select
                                        value={facility}
                                        onChange={handleChange}
                                        label="facility"
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        {facilities ? (
                                            facilities.map((item, key) => {
                                                return (
                                                    <MenuItem value={item}>{item?.facilityCode} - {item?.facilityName}</MenuItem>
                                                );
                                            })
                                        ) : null}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    ) : null}
                    {type && type === "Truck" && action && action === "STOP" ? (
                        <Box className="body-modal-item">
                            <Box className="body-modal-item-text">
                                <Typography>Facility:</Typography>
                            </Box>
                            <Box className="body-modal-item-input">
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">facility</InputLabel>
                                    <Select
                                        value={facility}
                                        onChange={handleChange}
                                        label="facility"
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        {facilities ? (
                                            facilities.map((item, key) => {
                                                return (
                                                    <MenuItem value={item}>{item?.facilityCode} - {item?.facilityName}</MenuItem>
                                                );
                                            })
                                        ) : null}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    ) : null}
                    <Box>{msg}</Box>
                </Box>
                <Divider />
                <Box className="footer-modal">
                    <Box className="btn-modal">
                        <Box>
                            <Button variant="outlined" color="error" onClick={handleCancel}>Cancel</Button>
                        </Box>
                        <Box>
                            <Button variant="contained" onClick={handleSubmit}>Save</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};
export default ModalTripItem;