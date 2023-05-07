import { Route, Switch, useRouteMatch } from "react-router";
import PurchaseOrderDetail from "../views/sellin/PurchaseOrderDetail";
import SaleOrderDetail from "../views/sellout/SaleOrderDetail";
import ExportingActivity from "../views/warehouse/export/ExportingActivity";
import Warehouse from "../views/warehouse/facility/Facility";
import ImportingActivity from "../views/warehouse/import/ImportingActivity";

export default function WarehouseRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={Warehouse} exact path={`${path}/inventory`}></Route>
        <Route
          component={ImportingActivity}
          exact
          path={`${path}/importing`}
        ></Route>
        <Route
          component={ExportingActivity}
          exact
          path={`${path}/exporting`}
        ></Route>
        <Route
          component={PurchaseOrderDetail}
          exact
          path={`${path}/importing/purchase-order-detail`}
        ></Route>
        <Route
          component={SaleOrderDetail}
          exact
          path={`${path}/exporting/sale-order-detail`}
        ></Route>
      </Switch>
    </div>
  );
}
