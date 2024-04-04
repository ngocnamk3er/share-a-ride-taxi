import { Route, Switch, useRouteMatch } from "react-router";
import SelectDriver from "screens/manage-route/SelectDriver";
import ListRouteOfDriver from "screens/manage-route/ListRouteOfDriver";
import DetailRoute from "screens/manage-route/DetailRoute";
import AddRequestToRoute from "screens/manage-route/AddRequestToRoute";

export default function ManageDriverRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={SelectDriver}
                    exact
                    path={`${path}/assign-route`}
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
                    component={DetailRoute}
                    exact
                    path={`${path}/assign-route/:id/list-routes/:routeId`}
                ></Route>
            </Switch>
            <Switch>
                <Route
                    component={AddRequestToRoute}
                    exact
                    path={`${path}/assign-route/:id/list-routes/:routeId/addrequests`}
                ></Route>
            </Switch>
        </div>
    );
}