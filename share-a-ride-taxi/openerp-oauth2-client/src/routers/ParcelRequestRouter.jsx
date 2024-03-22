import { Route, Switch, useRouteMatch } from "react-router";
import CreateParcelRequest from "../screens/parcel-request/CreateParcelRequest";
import DetailParcelRequest from "screens/parcel-request/DetailParcelRequest";
import ListParcelRequest from "screens/parcel-request/ListParcelRequest";
import UpdateParcelRequest from "screens/parcel-request/UpdateParcelRequest";

export default function ParcelRequestRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={CreateParcelRequest}
                    exact
                    path={`${path}/create`}
                ></Route>
            </Switch>
            <Switch>
                <Route
                    component={DetailParcelRequest}
                    exact
                    path={`${path}/list/:id`}
                ></Route>
            </Switch>
            <Switch>
                <Route
                    component={ListParcelRequest}
                    exact
                    path={`${path}/list`}
                ></Route>
            </Switch>
            <Switch>
                <Route
                    component={UpdateParcelRequest}
                    exact
                    path={`${path}/update/:id`}
                ></Route>
            </Switch>
        </div>
    );
}