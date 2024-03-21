import { Route, Switch, useRouteMatch } from "react-router";
import ListPassengerRequest from "../screens/passenger/ListPassengerRequest";
import passengerDemo from "../screens/passenger/passengerDemo";
import DetailPassengerRequest from "screens/passenger/DetailPassengerRequest";
import CreatePassengerRequest from "screens/passenger/CreatePassengerRequest";
import UpdatePassengerRequest from "screens/passenger/UpdatePassengerRequest";

export default function PassengerRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={CreatePassengerRequest}
                    exact
                    path={`${path}/create`}
                ></Route>
                <Route
                    component={ListPassengerRequest}
                    exact
                    path={`${path}/list`}
                ></Route>
                <Route
                    component={passengerDemo}
                    exact
                    path={`${path}/screen-2`}
                ></Route>
                <Route
                    component={DetailPassengerRequest}
                    exact
                    path={`${path}/list/:id`}
                ></Route>
                <Route
                    component={UpdatePassengerRequest}
                    exact
                    path={`${path}/update/:id`}
                ></Route>
            </Switch>
        </div>
    );
}