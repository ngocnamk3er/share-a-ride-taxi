import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ActivateDriver = () => {

    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        request("get", "/drivers", (res) => {
            const filteredDrivers = res.data.filter(driver => driver.statusId === 0);
            setDrivers(filteredDrivers);
        }).then();
    }, [])

    const columns = [
        {
            title: "Full name",
            field: "fullName",
        },
        {
            title: "Phone number",
            field: "phoneNumber",
        },
        {
            title: "Email",
            field: "email",
        },
        {
            title: "Gender",
            field: "gender",
        },
        {
            title: "Vehicle Type",
            field: "vehicleType",
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
            // Xử lý phản hồi từ API nếu cần
            // Sau khi kích hoạt thành công, cập nhật lại thông tin của tài xế đã được kích hoạt
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
                // hideCommandBar
                options={{
                    selection: false,
                    pageSize: 20,
                    search: true,
                    sorting: true,
                }}
            />
        </div>

    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(ActivateDriver, SCR_ID, true);
