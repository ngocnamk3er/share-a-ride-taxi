import { Route, Switch, useRouteMatch } from "react-router";
import passengerMenu from "../screens/passenger/passengerMenu";

export default function PassengerRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={passengerMenu}
                    exact
                    path={`${path}/screen-1`}
                ></Route>
            </Switch>
        </div>
    );
}