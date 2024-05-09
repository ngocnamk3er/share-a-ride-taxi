import { Route, Switch, useRouteMatch } from "react-router";
import WarehouseList from "screens/ware-house/WarehouseList";
import CreateWarehouse from "screens/ware-house/CreateWarehouse";
import DetailWareHouse from "screens/ware-house/DetailWareHouse";

export default function WarehouseRouter() {
    let { path } = useRouteMatch();
    return (
        <div>
            <Switch>
                <Route
                    component={WarehouseList}
                    exact
                    path={`${path}/list`}
                ></Route>
                <Route
                    component={DetailWareHouse}
                    exact
                    path={`${path}/list/:id`}
                ></Route>
                <Route
                    component={CreateWarehouse}
                    exact
                    path={`${path}/create`}
                ></Route>
                <Route
                    component={DetailWareHouse}
                    exact
                    path={`${path}/update/:id`}
                ></Route>
            </Switch>
        </div>
    );
}