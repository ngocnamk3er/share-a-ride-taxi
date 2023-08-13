import React, { useEffect, useState } from "react";
import { Alert, Box, Container, Divider, Typography } from "@mui/material";
import './styles.scss';
import HeaderContainerMana from "./HeaderContainerMana";
import ContentsContainerMana from "./ContentsContainerMana";
import { getContainers } from "api/ContainerAPI";
import SearchBar from "components/search/SearchBar";

const ContainerScreen = () => {
    const [containers, setContainers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [count, setCount] = useState(0);

    const [toastOpen, setToast] = useState(false);
    const [toastType, setToastType] = useState();
    const [toastMsg, setToastMsg] = useState('');

    const [openModal, setOpenModal] = useState(false);

    const [flag, setFlag] = useState(false);

    const [filters, setFilters] = useState([]);

    const status = [
        { name: "AVAILABLE" },
        { name: "ORDERED" },
        { name: "SCHEDULED" },
        { name: "EXECUTING" }
    ]

    useEffect(() => {
        let data = { 
            page: page,
            pageSize: rowsPerPage,
        }
        let code = filters.find((item) => item.type === "code");
        if(code) {
            data.containerCode = code.value;
        }
        let status = filters.find((item) => item.type === "status");
        if(status) {
            data.status = status.value;
        }
        getContainers(data)
            .then((res) => {
                console.log("container==========", res?.data.data.containerModels);
                setContainers(res?.data.data.containerModels);
                setCount(res?.data.data.count);
            });
    }, [openModal, page, rowsPerPage, flag])

    useEffect(() => {
        let data = { 
            page: page,
            pageSize: rowsPerPage,
        }
        let code = filters.find((item) => item.type === "code");
        if(code) {
            data.containerCode = code.value;
            data.page = 0;
            setPage(0);
        }
        let status = filters.find((item) => item.type === "status");
        if(status) {
            data.status = status.value;
            data.page = 0;
            setPage(0);
        }
        getContainers(data)
            .then((res) => {
                console.log("container==========", res?.data.data.containerModels);
                setContainers(res?.data.data.containerModels);
                setCount(res?.data.data.count);
            });
    }, [filters])

    const handleClose = () => {
        setOpenModal(!openModal);
    }
    return (
        <Box className="fullScreen">
            <Container maxWidth="100vw" className="container">
                <Box className="toast">
                    {toastOpen ? (
                        <Alert variant="filled" severity={toastType} >
                            <strong>{toastMsg}</strong >
                        </Alert >) : null}
                </Box>
                <HeaderContainerMana openModal={openModal} handleClose={handleClose}
                    setToast={setToast} setToastType={setToastType} setToastMsg={setToastMsg} />
                <Box className="divider">
                    <Divider />
                </Box>
                <Box>
                    <SearchBar filters={filters} setFilters={setFilters} status={status} type="status" />
                </Box>
                <ContentsContainerMana containers={containers} page={page} setPage={setPage}
                    rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} count={count}
                    setToast={setToast} setToastType={setToastType} setToastMsg={setToastMsg}
                    flag={flag} setFlag={setFlag} />
            </Container>
        </Box>
    )
}
export default ContainerScreen;