import { Route, Switch, useRouteMatch } from "react-router";
import ListDrivers from "../screens/manage-drivers/ListDrivers";
import SelectDriver from "screens/manage-route/SelectDriver";
import AddRequestToRoute from "screens/manage-route/AddRequestToRoute";
import ListRouteOfDriver from "screens/manage-route/ListRouteOfDriver";

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
        </div>
    );
}