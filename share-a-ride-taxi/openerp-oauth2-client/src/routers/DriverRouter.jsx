import { Route, Switch, useRouteMatch } from "react-router";
import RegisterDriver from "screens/driver/RegisterDriver";

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
            </Switch>
        </div>
    );
}