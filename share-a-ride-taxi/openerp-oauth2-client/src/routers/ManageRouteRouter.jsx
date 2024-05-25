import { Route, Switch, useRouteMatch } from "react-router";
import AssignParcelRoute from "../screens/manage-route/AssignParcelRoute";
import AssignPassengerRoute from "screens/manage-route/AssignPassengerRoute";
import ParcelRouteList from "screens/manage-route/ParcelRouteList";
import DetailPickUpParcelRoute from "screens/manage-route/DetailPickUpParcelRoute";
import DetailDropOffParcelRoute from "screens/manage-route/DetailDropOffParcelRoute";
import DetailWarehouseRoute from "screens/manage-route/DetailWarehouseRoute";
import AddRequestToPickUpRoute from "screens/manage-route/AddRequestToPickUpRoute";


export default function ManageRouteRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={ParcelRouteList}
                    exact
                    path={`${path}/parcel-route-list`}
                ></Route>
                <Route
                    component={DetailPickUpParcelRoute}
                    exact
                    path={`${path}/parcel-route-list/pick-up-route/:id`}
                ></Route>
                <Route
                    component={AddRequestToPickUpRoute}
                    exact
                    path={`${path}/parcel-route-list/pick-up-route/:id/add-request`}
                ></Route>
                <Route
                    component={DetailDropOffParcelRoute}
                    exact
                    path={`${path}/parcel-route-list/drop-off-route/:id`}
                ></Route>
                <Route
                    component={DetailWarehouseRoute}
                    exact
                    path={`${path}/parcel-route-list/warehouse-route/:id`}
                ></Route>
                <Route
                    component={AssignParcelRoute}
                    exact
                    path={`${path}/assign-parcel-route`}
                ></Route>
                <Route
                    component={AssignPassengerRoute}
                    exact
                    path={`${path}/assign-passenger-route`}
                ></Route>
            </Switch>
        </div>
    );
}