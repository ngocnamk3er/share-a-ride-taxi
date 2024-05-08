import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useHistory } from "react-router-dom";
import { useRouteMatch } from 'react-router-dom';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";

const SelectDriver = () => {
    const history = useHistory();
    const [drivers, setDrivers] = useState([]);

    let { path } = useRouteMatch();

    useEffect(() => {
        request("get", "/drivers", (res) => {
            const filteredDrivers = res.data.filter(driver => driver.statusId === 1);
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
    ];

    const handleRowClick = (event, rowData) => {
        const driverId = rowData.id;
        history.push(`${path}/${driverId}/list-routes`);
    };

    return (
        <div>
            <h2>Select driver to assign work</h2>
            <StandardTable
                title="Driver List"
                columns={columns}
                data={drivers}
                onRowClick={handleRowClick}
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

const SCR_ID = "SCR_SAR_LIST_DRIVERS";
export default withScreenSecurity(SelectDriver, SCR_ID, true);
