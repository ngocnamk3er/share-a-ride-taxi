import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DetailDriver from "components/detail-driver/DetailDriver";

const ActivateDriver = () => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        request("get", "/drivers", (res) => {
            const filteredDrivers = res.data.filter(driver => driver.statusId === 0);
            setDrivers(filteredDrivers);
        }).then();
    }, [])

    const handleViewClick = (rowData) => {
        setSelectedDriver(rowData);
    };

    const handleModalClose = () => {
        setSelectedDriver(null);
    };

    const columns = [
        {
            title: "Full name",
            field: "fullName",
        },
        {
            title: "Phone number",
            field: "phoneNumber",
        },
        // {
        //     title: "Email",
        //     field: "email",
        // },
        {
            title: "Gender",
            field: "gender",
        },
        {
            title: "Vehicle Type",
            field: "vehicleTypeId",
            lookup: {
                0: 'Car',
                1: 'Mini Truck',
                2: 'Truck',
            },
        },
        {
            title: "Vehicle License Plate",
            field: "vehicleLicensePlate",
        },
        {
            title: "Status",
            field: "statusId",
            lookup: {
                0: 'Waiting',
                1: 'Active',
                2: 'Inactive',
            },
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
        {
            title: "Activate driver",
            sorting: false,
            render: (rowData) => (
                <IconButton
                    onClick={() => activateDriver(rowData.id)}
                    variant="contained"
                    color="success"
                >
                    <CheckCircleIcon />
                </IconButton>
            ),
        },
    ];

    const activateDriver = (driverId) => {
        request("post", `/drivers/${driverId}/activate`, (res) => {
            const activatedDriver = res.data;
            setDrivers(prevDrivers => {
                return prevDrivers.filter(driver => {
                    return driver.id !== activatedDriver.id;
                });
            });
        });
    };

    return (
        <div>
            <StandardTable
                title="List of drivers waiting for activation"
                columns={columns}
                data={drivers}
                options={{
                    selection: false,
                    pageSize: 20,
                    search: true,
                    sorting: true,
                }}
            />
            <Modal
                open={selectedDriver !== null} // Sử dụng open để điều khiển hiển thị của Modal
                onClose={handleModalClose} // Xử lý sự kiện đóng Modal
            >
                <div>
                    {selectedDriver && <DetailDriver driver={selectedDriver} onClose={handleModalClose} />} {/* Truyền props driver */}
                </div>
            </Modal>
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(ActivateDriver, SCR_ID, true);
