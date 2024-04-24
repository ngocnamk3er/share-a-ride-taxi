import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const RegisterDriver = () => {

    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        request("get", "/drivers", (res) => {
            setDrivers(res.data);
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
            filter: true
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
        </div>

    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(RegisterDriver, SCR_ID, true);
