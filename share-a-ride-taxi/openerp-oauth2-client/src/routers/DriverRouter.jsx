import { Route, Switch, useRouteMatch } from "react-router";
import RegisterDriver from "screens/driver/RegisterDriver";
import DriverInfo from "screens/driver/DriverInfo";
import RegisterWareHouseDriver from "screens/driver/RegisterWareHouseDriver";

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
                    component={RegisterWareHouseDriver}
                    exact
                    path={`${path}/warehouse`}
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