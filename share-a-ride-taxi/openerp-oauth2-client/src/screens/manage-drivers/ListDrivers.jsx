import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DetailDriver from "components/detail-driver/DetailDriver";


const ListDrivers = () => {

    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);

    useEffect(() => {
        request("get", "/drivers", (res) => {
            setDrivers(res.data);
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
            filter: true
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

    const demoFunction = (driver) => {
        alert("You clicked on Driver: " + driver.id)
    }

    return (
        <div>
            <StandardTable
                title="Driver List"
                columns={columns}
                data={drivers}
                // hideCommandBar
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

const SCR_ID = "SCR_SAR_LIST_DRIVERS";
export default withScreenSecurity(ListDrivers, SCR_ID, true);
