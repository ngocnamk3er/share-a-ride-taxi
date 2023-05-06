import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Button } from "@mui/material";
import CustomToolBar from "components/toolbar/CustomToolBar";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useWindowSize } from "react-use";
import { Action } from "../../components/action/Action";
import withScreenSecurity from "../../components/common/withScreenSecurity";
import CustomDataGrid from "../../components/datagrid/CustomDataGrid";
import { useGetReceiptBillList } from "../../controllers/query/bill-query";
import { useGetPurchaseOrderList } from "../../controllers/query/purchase-order-query";
function ImportingActivityScreen({ screenAuthorization }) {
  let { path } = useRouteMatch();
  const [params, setParams] = useState({
    page: 1,
    page_size: 50,
  });
  const history = useHistory();
  const { height } = useWindowSize();

  const { isLoading, data } = useGetPurchaseOrderList({
    orderStatus: "accepted",
  });
  const { isLoading: isLoadingReceiptBill, data: receiptBills } =
    useGetReceiptBillList({
      orderStatus: "accepted",
    });

  const handleButtonClick = (params) => {
    history.push(`${path}/purchase-order-detail`, {
      order: params,
    });
  };

  let actions = [
    {
      title: "Nhập kho",
      callback: (pre) => {
        handleButtonClick();
      },
      icon: <AddIcon />,
      describe: "Thêm bản ghi mới",
      disabled: false,
    },
    {
      title: "Sửa",
      callback: () => {
        console.log("call back");
      },
      icon: <AddIcon />,
      describe: "Thêm bản ghi mới",
      disabled: false,
    },
  ];
  const extraActions = [
    {
      title: "Xem chi tiết",
      callback: (item) => {
        handleButtonClick(item);
      },
      icon: <VisibilityIcon />,
      // permission: PERMISSIONS.MANAGE_CATEGORY_EDIT,
    },
    {
      title: "Xóa",
      callback: (item) => {
        // setIsRemove();
        // setItemSelected(item);
      },
      icon: <DeleteIcon />,
      // permission: PERMISSIONS.MANAGE_CATEGORY_DELETE,
    },
  ];
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box>
        <CustomToolBar actions={actions} />
      </Box>
      <CustomDataGrid
        params={params}
        setParams={setParams}
        sx={{ height: height - 64 - 71 - 24 - 20 }} // Toolbar - Searchbar - TopPaddingToolBar - Padding bottom
        isLoading={isLoading}
        totalItem={100}
        columns={[
          {
            field: "code",
            headerName: "Mã code",
            sortable: false,
            pinnable: true,
          },
          {
            field: "supplierCode",
            headerName: "Mã nhà sản xuất",
            sortable: false,
            minWidth: 150,
          },
          {
            field: "totalMoney",
            headerName: "Tổng tiền đặt",
            sortable: false,
            minWidth: 150,
          },
          {
            field: "totalPayment",
            headerName: "Tổng tiền trả",
            sortable: false,
            minWidth: 150,
          },
          {
            field: "vat",
            headerName: "VAT",
            sortable: false,
            minWidth: 150,
          },
          {
            field: "createdBy",
            headerName: "Tạo bởi",
            sortable: false,
            minWidth: 150,
            valueGetter: (params) => {
              return params.row.user.id;
            },
          },
          {
            field: "createdDate",
            headerName: "Thời điểm tạo",
            sortable: false,
            minWidth: 150,
          },
          {
            field: "status",
            headerName: "Trạng thái",
            sortable: false,
            minWidth: 150,
            renderCell: (params) => {
              return (
                <Button variant="outlined" color="info">
                  {params?.row?.status}
                </Button>
              );
            },
          },
          {
            field: "facility",
            headerName: "Kho trực thuộc",
            sortable: false,
            minWidth: 150,
            valueGetter: (params) => {
              return params.row.facility.name;
            },
          },
          {
            field: "quantity",
            headerName: "Hành động",
            sortable: false,
            minWidth: 200,
            type: "actions",
            renderCell: (params) => (
              <Action
                disabled={false}
                extraAction={extraActions[0]}
                item={params.row}
                onActionCall={extraActions[0].callback}
              />
            ),
          },
        ]}
        rows={data ? data?.content : []}
      />
      <CustomDataGrid
        params={params}
        setParams={setParams}
        sx={{ height: height - 64 - 71 - 24 - 20 }} // Toolbar - Searchbar - TopPaddingToolBar - Padding bottom
        isLoading={isLoading}
        totalItem={100}
        columns={[
          {
            field: "code",
            headerName: "Mã code",
            sortable: false,
            pinnable: true,
          },
          {
            field: "createdDate",
            headerName: "Thời điểm tạo",
            sortable: false,
            minWidth: 150,
          },
          {
            field: "status",
            headerName: "Trạng thái",
            sortable: false,
            minWidth: 150,
            renderCell: (params) => {
              return (
                <Button variant="outlined" color="info">
                  {"IN PROGRESS"}
                </Button>
              );
            },
          },
          {
            field: "facility",
            headerName: "Kho trực thuộc",
            sortable: false,
            minWidth: 150,
            valueGetter: (params) => {
              return params.row.facility.name;
            },
          },
          {
            field: "order",
            headerName: "Mã đơn hàng",
            sortable: false,
            minWidth: 150,
            valueGetter: (params) => {
              return params.row.purchaseOrder.code;
            },
          },
          {
            field: "quantity",
            headerName: "Hành động",
            sortable: false,
            minWidth: 200,
            type: "actions",
            renderCell: (params) => (
              <Action
                disabled={false}
                extraAction={extraActions[0]}
                item={params.row}
                onActionCall={extraActions[0].callback}
              />
            ),
          },
        ]}
        rows={receiptBills ? receiptBills?.content : []}
      />
    </Box>
  );
}

const SCR_ID = "SCR_IMPORTING_ACTIVITY";
export default withScreenSecurity(ImportingActivityScreen, SCR_ID, true);
