import { Route, Switch, useRouteMatch } from "react-router";
import AddShipmentOrder from "../views/delivery/AddShipmentOrder";
import SplitBillDetail from "../views/delivery/SplitBillDetail";
import Shipment from "../views/delivery/shipment/Shipment";
import ShipmentDetail from "../views/delivery/shipment/ShipmentDetail";
import Trip from "../views/delivery/shipment/TripDetail";

export default function DeliveryRouter() {
  let { path } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route component={Shipment} exact path={`${path}/shipment`}></Route>
        <Route
          component={ShipmentDetail}
          exact
          path={`${path}/shipment/shipment-detail`}
        ></Route>
        <Route
          component={Trip}
          exact
          path={`${path}/shipment/shipment-detail/trip-detail`}
        ></Route>
        <Route
          component={AddShipmentOrder}
          exact
          path={`${path}/split-order`}
        ></Route>
        <Route
          component={SplitBillDetail}
          exact
          path={`${path}/split-order/split-bill-detail`}
        ></Route>
        {/* <Route component={Truck} exact path={`${path}/vehicle/truck`}></Route>
        <Route component={Drone} exact path={`${path}/vehicle/drone`}></Route> */}
      </Switch>
    </div>
  );
}
