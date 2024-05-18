import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { request } from "../../api";  // Giả sử bạn có hàm request tương tự như trong đoạn code trước
import { StandardTable } from "erp-hust/lib/StandardTable";
import keycloak from "config/keycloak";
import { jwtDecode } from "jwt-decode";

const Warehouse = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [driverId, setDriverId]= useState(); // Lấy driverId từ URL

    useEffect(() => {
        const token = keycloak.token;
        const decodedToken = jwtDecode(token);
        const { preferred_username } = decodedToken;
        const userId = preferred_username;
        setDriverId(userId);
    }, []);

    useEffect(() => {
        if (driverId) {
            request("get", `/driver-warehouses/${driverId}`, (res) => {
                setWarehouses(res.data);
            }).then();
        }
    }, [driverId]);

    const columns = [
        {
            title: "Warehouse ID",
            field: "warehouseId",
        },
        {
            title: "Joining Date",
            field: "joiningDate",
        },
        {
            title: "Active",
            field: "active",
            render: rowData => rowData.active ? "Active" : "Waiting" // Hiển thị trạng thái active
        }
    ];

    return (
        <div>
            <h1>Warehouses for Driver: {driverId}</h1>
            <StandardTable
                title="Driver Warehouses"
                columns={columns}
                data={warehouses}
                options={{
                    selection: false,
                    pageSize: 10,
                    search: true,
                    sorting: true,
                }}
            />
        </div>
    );
};

export default Warehouse;
