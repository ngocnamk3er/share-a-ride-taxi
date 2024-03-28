import { Route, Switch, useRouteMatch } from "react-router";
import ListDrivers from "../screens/manage-drivers/ListDrivers";
import SelectDriver from "screens/manage-drivers/assign-route/SelectDriver";
import AddRequestToRoute from "screens/manage-drivers/assign-route/AddRequestToRoute";
import ListRouteOfDriver from "screens/manage-drivers/assign-route/ListRouteOfDriver";

export default function ManageDriverRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={ListDrivers}
                    exact
                    path={`${path}/list-drivers`}
                ></Route>
            </Switch>
            <Switch>
                <Route
                    component={ListRouteOfDriver}
                    exact
                    path={`${path}/assign-route/:id/list-routes`}
                ></Route>
            </Switch>
            <Switch>
                <Route
                    component={AddRequestToRoute}
                    exact
                    path={`${path}/assign-route/:id/list-routes/:routeId`}
                ></Route>
            </Switch>
            <Switch>
                <Route
                    component={SelectDriver}
                    exact
                    path={`${path}/assign-route`}
                ></Route>
            </Switch>
        </div>
    );
}