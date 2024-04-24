import { Route, Switch, useRouteMatch } from "react-router";
import ListDrivers from "../screens/manage-drivers/ListDrivers";
import ActivateDriver from "screens/manage-drivers/ActivateDriver";

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
                <Route
                    component={ActivateDriver}
                    exact
                    path={`${path}/active-driver`}
                ></Route>
            </Switch>
        </div>
    );
}