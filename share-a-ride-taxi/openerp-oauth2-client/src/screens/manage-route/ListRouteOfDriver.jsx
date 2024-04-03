import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useParams, useHistory } from "react-router-dom";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import { useRouteMatch } from 'react-router-dom';

const ListRouteOfDriver = () => {
    const [routes, setRoutes] = useState([]);
    const [driverName, setDriverName] = useState([]);
    const { id } = useParams();
    const history = useHistory();
    let { path } = useRouteMatch();

    useEffect(() => {
        request("get", `/routes/search?driverId=${id}`, (res) => {
            setRoutes(res.data);
        }).then();

        request("get", `/drivers/${id}`, (res) => {
            setDriverName(res.data.fullName);
        }).then();

    }, [id]); // Add id to the dependency array

    const handleRowClick = (event, rowData) => {
        const currentPath = history.location.pathname; // Lấy đường dẫn hiện tại
        const newPath = `${currentPath}/${rowData.id}`; // Tạo đường dẫn mới với rowData.id
        history.push(newPath); // Chuyển hướng đến đường dẫn mới
    };

    const columns = [
        {
            title: "Tilte ",
            field: "title",
        },
        {
            title: "Description",
            field: "description",
        },
    ];

    return (
        <div>
            <StandardTable
                title={`List routes of Driver ${driverName}`}
                columns={columns}
                data={routes}
                onRowClick={handleRowClick}
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

const SCR_ID = "SCR_SAR_LIST_ROUTE_DRIVERS";
export default withScreenSecurity(ListRouteOfDriver, SCR_ID, true);
