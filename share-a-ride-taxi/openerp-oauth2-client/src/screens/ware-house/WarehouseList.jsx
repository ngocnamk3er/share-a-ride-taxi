import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import VisibilityIcon from '@mui/icons-material/Visibility';
import DetailDriver from "components/detail-driver/DetailDriver";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from 'react-router-dom';

const WarehouseList = () => {
    const history = useHistory(); // Initialize useHistory hook
    let { path } = useRouteMatch();

    const [warehouses, setWareHouses] = useState([]);
   

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
        </div>

    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(WarehouseList, SCR_ID, true);
