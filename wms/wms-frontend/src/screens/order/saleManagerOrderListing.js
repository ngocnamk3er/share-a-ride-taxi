import { useRouteMatch } from "react-router-dom";
 import { Fragment, useEffect, useState } from "react"
import StandardTable from "components/StandardTable"
import { request } from "api";
import { API_PATH } from "screens/apiPaths";
import { convertToVNDFormat } from "screens/utils/utils";
import LoadingScreen from "components/common/loading/loading";

const SaleManagerOrderListing = () => {
  const { path } = useRouteMatch();
  const [ordersTableData, setOrdersTableData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      await request(
        "get",
        // API_PATH.ADMIN_SALE_ORDER + `?orderStatus=${ORDER_STATUS_CODE.CREATED}`,
        API_PATH.ADMIN_SALE_ORDER,
        (res) => {
          var data = res.data;
          for (var i = 0; i < data.length; i++) {
            const cost = data[i]?.totalOrderCost;
            const costFormated = convertToVNDFormat(cost);
            data[i].totalOrderCost = costFormated;
          }
          setOrdersTableData(data); 
        }
      );

      setLoading(false);
    }

    fetchData();
  }, []);

  return (
  isLoading ? <LoadingScreen /> :
  <Fragment>
    <StandardTable
      title="Danh sách đơn hàng"
      columns={[
        { title: "Ngày tạo đơn", field: "createdOrderDate" }, 
        { title: "Loại đơn hàng", field: "orderType" },
        { title: "Trạng thái", field: "status" },
        { title: "Tổng giá trị", field: "totalOrderCost" }
      ]}
      data={ordersTableData}
      options={{
        selection: false,
        pageSize: 10,
        search: true,
        sorting: true,
      }}
      onRowClick={(event, rowData) => {
        window.location.href = `${path}/${rowData.orderId}`;
      }}
    />
  </Fragment>);
}

export default SaleManagerOrderListing;