import { Route, Switch, useRouteMatch } from "react-router";
import RegisterDriver from "screens/driver/RegisterDriver";
import DriverInfo from "screens/driver/DriverInfo";

export default function DriverRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={RegisterDriver}
                    exact
                    path={`${path}/register`}
                ></Route>
                <Route
                    component={DriverInfo}
                    exact
                    path={`${path}/info`}
                ></Route>
            </Switch>
        </div>
    );
}