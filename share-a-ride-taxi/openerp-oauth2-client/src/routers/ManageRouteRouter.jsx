import { Route, Switch, useRouteMatch } from "react-router";
import AssignParcelRoute from "../screens/manage-route/AssignParcelRoute";
import AssignPassengerRoute from "screens/manage-route/AssignPassengerRoute";

export default function ManageRouteRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
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