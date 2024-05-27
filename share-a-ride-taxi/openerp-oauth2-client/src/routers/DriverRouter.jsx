import { Route, Switch, useRouteMatch } from "react-router";
import RegisterDriver from "screens/driver/RegisterDriver";
import DriverInfo from "screens/driver/DriverInfo";
import RegisterWareHouseDriver from "screens/driver/RegisterWareHouseDriver";
import Warehouse from "screens/driver/Warehouse";
import DriverRoute from "screens/driver/DriverRoute";
import DetailPickUpParcelRoute from "screens/manage-route/DetailPickUpParcelRoute";
import DetailDropOffParcelRoute from "screens/manage-route/DetailDropOffParcelRoute";
import DetailWarehouseRoute from "screens/manage-route/DetailWarehouseRoute";

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
                    path={`${path}/resgister-warehouse-driver`}
                ></Route>
                <Route
                    component={DriverInfo}
                    exact
                    path={`${path}/info`}
                ></Route>
                <Route
                    component={DriverRoute}
                    exact
                    path={`${path}/route`}
                ></Route>
                <Route
                    exact
                    path={`${path}/route/pick-up-route/:id`}
                    render={(props) => <DetailPickUpParcelRoute {...props} isDriver={true} />}
                />
                <Route
                    component={DetailDropOffParcelRoute}
                    exact
                    path={`${path}/route/drop-off-route/:id`}
                ></Route>
                <Route
                    component={DetailWarehouseRoute}
                    exact
                    path={`${path}/route/warehouse-route/:id`}
                ></Route>
                <Route
                    component={Warehouse}
                    exact
                    path={`${path}/warehouse`}
                ></Route>
            </Switch>
        </div>
    );
}