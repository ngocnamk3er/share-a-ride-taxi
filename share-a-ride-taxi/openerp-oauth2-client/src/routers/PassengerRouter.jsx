import { Route, Switch, useRouteMatch } from "react-router";
import passengerMenu from "../screens/passenger/passengerMenu";
import passengerDemo from "../screens/passenger/passengerDemo";
import CreatePassenger from "screens/passenger/DetailPassenger";

export default function PassengerRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={passengerMenu}
                    exact
                    path={`${path}/passenger`}
                ></Route>
                <Route
                    component={passengerDemo}
                    exact
                    path={`${path}/screen-2`}
                ></Route>
                <Route
                    component={CreatePassenger}
                    exact
                    path={`${path}/passenger/:id`}
                ></Route>
            </Switch>
        </div>
    );
}