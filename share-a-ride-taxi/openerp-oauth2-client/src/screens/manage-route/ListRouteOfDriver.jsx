import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { useParams, useHistory } from "react-router-dom";
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";
import { useRouteMatch } from 'react-router-dom';
import { format, isSameDay, isAfter } from 'date-fns';
import { Button } from "@mui/material";
import { Typography } from "@mui/material";

const ListRouteOfDriver = () => {
    const [routeGroups, setRouteGroups] = useState([]);
    const [driverName, setDriverName] = useState([]);
    const { id } = useParams();
    const history = useHistory();
    let { path } = useRouteMatch();
    const [showAll, setShowAll] = useState(false);
    const [showExpandButton, setShowExpandButton] = useState(true);

    useEffect(() => {
        request("get", `/routes/search?driverId=${id}`, (res) => {
            const routes = res.data.reverse();
            const groupedRoutes = groupRoutesByDate(routes);
            setRouteGroups(groupedRoutes);
        }).then();

        request("get", `/drivers/${id}`, (res) => {
            setDriverName(res.data.fullName);
        }).then();

    }, [id]);

    const groupRoutesByDate = (routes) => {
        const groups = [];
        routes.forEach((route) => {
            const routeDate = new Date(route.startExecutionStamp).toDateString();
            const existingGroupIndex = groups.findIndex(group => isSameDay(new Date(group.date), new Date(route.startExecutionStamp)));
            if (existingGroupIndex !== -1) {
                groups[existingGroupIndex].routes.push(route);
            } else {
                groups.push({ date: routeDate, routes: [route] });
            }
        });
        return groups;
    };

    const handleRowClick = (event, rowData) => {
        const currentPath = history.location.pathname;
        const newPath = `${currentPath}/${rowData.id}`;
        history.push(newPath);
    };

    const toggleShowAll = () => {
        setShowAll(!showAll);
        // setShowExpandButton(!showExpandButton);
    };

    const handleCreateRputeForThisDriver = () => {
        const currentPath = history.location.pathname; // Lấy đường dẫn hiện tại
        const newPath = currentPath.replace('/list-routes', '/create-route'); // Loại bỏ '/addrequests' từ currentPath
        history.push(newPath); // Chuyển hướng đến đường dẫn mới
    }

    const renderGroupedRoutes = () => {
        return routeGroups.map((group, index) => {
            const currentDate = new Date(group.date);
            const isPastDate = isAfter(new Date(), currentDate);
            const shouldShow = showAll || !isPastDate;
            return (
                <div key={index}>
                    {/* <h2>{group.date}</h2> */}
                    {shouldShow && (
                        <StandardTable
                            title={`Routes on ${group.date}`}
                            columns={[
                                { title: "Tilte", field: "title" },
                                { title: "Start execution time", field: "startExecutionStamp", render: rowData => format(new Date(rowData.startExecutionStamp), "'Ngày' dd/MM/yyyy 'lúc' HH:mm") },
                                { title: "Description", field: "description" }
                            ]}
                            data={group.routes}
                            onRowClick={handleRowClick}
                            options={{
                                selection: false,
                                pageSize: 3,
                                search: true,
                                sorting: true,
                            }}
                        />
                    )}
                </div>
            );
        });
    };

    return (
        <div>
            <Typography style={{ marginBottom: '16px' }} variant="h4">The route list is assigned to driver {driverName}</Typography>
            <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={handleCreateRputeForThisDriver}>Create new route</Button>
            <br />
            <br />
            {renderGroupedRoutes()}
            <br />
            <br />
            {showExpandButton && (
                <Button style={{ backgroundColor: 'blue', color: 'white' }} onClick={toggleShowAll}>{showAll ? "Thu gọn" : "Lịch sử"}</Button>
            )}
        </div>
    );
}

const SCR_ID = "SCR_SAR_LIST_ROUTE_DRIVERS";
export default withScreenSecurity(ListRouteOfDriver, SCR_ID, true);
