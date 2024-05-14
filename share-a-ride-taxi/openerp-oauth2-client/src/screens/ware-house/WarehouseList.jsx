import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import DetailDriver from "components/detail-driver/DetailDriver";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from 'react-router-dom';
import Modal from "@mui/material/Modal";
import MultiLocationMap from "../../components/multi-location-map/MultiLocationMap"; // Đảm bảo đường dẫn đến component MultiLocationMap là chính xác
import { Typography, CircularProgress, Grid } from "@mui/material";

const WarehouseList = () => {
    const history = useHistory(); // Initialize useHistory hook
    let { path } = useRouteMatch();
    const [isMapModalOpen, setMapModalOpen] = useState(false);

    const [warehouses, setWareHouses] = useState([]);

    const handleOpenMapModal = () => {
        setMapModalOpen(true);
    };

    const handleCloseMapModal = () => {
        setMapModalOpen(false);
    };


    useEffect(() => {
        request("get", "/warehouses", (res) => {
            setWareHouses(res.data);
        }).then();
    }, [])

    const handleViewClick = (rowData) => {
        history.push(`${path}/${rowData.warehouseId}`);
    };


    const columns = [
        {
            title: "Warehouse id",
            field: "warehouseId",
        },
        {
            title: "Warehouse Name",
            field: "warehouseName",
        },
        {
            title: "Address",
            field: "address",
        },
        {
            title: "Address Note",
            field: "addressNote",
        },
        {
            title: "View",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => {
                        handleViewClick(rowData);
                    }}
                    variant="contained"
                    color="primary"
                >
                    <VisibilityIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <div>
            <div className="title-container">
                <Button
                    className="view-in-map-button" // Đây là class mới cho Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenMapModal()}
                >
                    View in map
                    <VisibilityIcon style={{ marginLeft: '5px' }} />
                </Button>
            </div>
            <br />
            <StandardTable
                title="Warehouse list"
                columns={columns}
                data={warehouses}
                // hideCommandBar
                options={{
                    selection: false,
                    pageSize: 20,
                    search: true,
                    sorting: true,
                }}
            />
            <Modal
                open={isMapModalOpen}
                onClose={handleCloseMapModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                
            >
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        margin: "auto",
                        width: "80vw",
                        height: "80vh",
                        backgroundColor: "#fff",
                        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        padding: "20px",
                        display: "flex"
                    }}>
                    <MultiLocationMap locations={warehouses} />
                </div>
            </Modal>

        </div>

    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(WarehouseList, SCR_ID, true);
