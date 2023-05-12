import { Button, Typography } from "@mui/material";
import { unix } from "moment";
import { AppColors } from "../../shared/AppColors";

export const shipmentCols = [
  {
    field: "code",
    headerName: "Mã đợt",
    sortable: false,
    pinnable: true,
    width: 125,
    minWidth: 150,
    maxWidth: 200,
    renderCell: (params) => {
      return (
        <Typography sx={{ color: AppColors.secondary, fontWeight: "500" }}>
          {params?.row?.code}
        </Typography>
      );
    },
  },
  {
    field: "title",
    headerAlign: "center",
    align: "center",
    headerName: "Tên đợt giao",
    sortable: false,
    minWidth: 250,
  },
  {
    field: "userCreated",
    headerAlign: "center",
    align: "center",
    headerName: "Người tạo",
    sortable: false,
    minWidth: 250,
    valueGetter: (item) => {
      return item?.row?.user?.id;
    },
  },
  {
    field: "startedDate",
    headerName: "Ngày bắt đầu",
    headerAlign: "center",
    align: "center",
    sortable: false,
    minWidth: 200,
    valueGetter: (item) => {
      return unix(item?.row?.startedDate).format("DD/MM/YYYY");
    },
  },
  {
    field: "endedDate",
    headerName: "Ngày kết thúc dự kiến",
    sortable: false,
    headerAlign: "center",
    align: "center",
    minWidth: 200,
    valueGetter: (item) => {
      return unix(item?.row?.endedDate).format("DD/MM/YYYY");
    },
  },
];
export const tripCols = [
  {
    field: "code",
    headerName: "Mã chuyến",
    sortable: false,
    pinnable: true,
    width: 125,
    minWidth: 150,
    maxWidth: 200,
    renderCell: (params) => {
      return (
        <Typography sx={{ color: AppColors.secondary, fontWeight: "500" }}>
          {params?.row?.code}
        </Typography>
      );
    },
  },
  {
    field: "startedDate",
    headerName: "Ngày bắt đầu",
    headerAlign: "center",
    align: "center",
    sortable: false,
    minWidth: 150,
    valueGetter: (item) => {
      return unix(item?.row?.startedDate).format("DD/MM/YYYY");
    },
  },
  {
    field: "createdBy",
    headerName: "Người tạo",
    headerAlign: "center",
    align: "center",
    sortable: false,
    minWidth: 150,
    valueGetter: (item) => {
      return item?.row?.creator?.id;
    },
  },
  {
    field: "userInCharge",
    headerAlign: "center",
    align: "center",
    headerName: "Người thực hiện",
    sortable: false,
    minWidth: 150,
    valueGetter: (item) => {
      return item?.row?.userInCharge?.id;
    },
  },
  {
    field: "shipment",
    headerName: "Mã đợt giao",
    headerAlign: "center",
    align: "center",
    sortable: false,
    minWidth: 150,
    valueGetter: (item) => {
      return item?.row?.shipment?.code;
    },
  },
  {
    field: "facility",
    headerAlign: "center",
    align: "center",
    headerName: "Kho lấy hàng",
    sortable: false,
    minWidth: 200,
    valueGetter: (item) => {
      return item?.row?.facility?.name;
    },
  },
];
export const shipmentItemCols = [
  {
    field: "code",
    headerName: "Mã code",
    sortable: false,
    pinnable: true,
    minWidth: 150,
  },
  {
    field: "createdDate",
    headerAlign: "center",
    align: "center",
    headerName: "Thời điểm tạo",
    sortable: false,
    minWidth: 150,
    valueGetter: (params) => {
      return unix(params?.row?.createdDate).format("DD-MM-YYYY");
    },
  },
  {
    field: "boughtBy",
    headerAlign: "center",
    align: "center",
    headerName: "Mua bởi",
    sortable: false,
    minWidth: 150,
    valueGetter: (params) => {
      return params?.row?.deliveryBill?.saleOrder?.customer?.name;
    },
  },
  {
    field: "product",
    headerAlign: "center",
    align: "center",
    headerName: "Tên sản phẩm",
    sortable: false,
    minWidth: 200,
    // valueGetter: (params) => {
    //   return params?.row?.deliveryBill?.saleOrder?.customer?.name;
    // },
  },
  {
    field: "quantity",
    headerAlign: "center",
    align: "center",
    headerName: "Số lượng",
    sortable: false,
    minWidth: 100,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    sortable: false,
    width: 125,
    minWidth: 150,
    maxWidth: 200,
    renderCell: (params) => {
      return (
        <Button
          variant="contained"
          sx={{
            borderRadius: "2px",
            borderWidth: "1px",
            paddingY: 1,
            paddingX: 2,
            height: "24px",
            background: AppColors.primary,
            // ORDER_STATUS_COLOR_MAPPING[params?.row?.status.toLowerCase()],
          }}
        >
          <Typography
            sx={{
              textTransform: "lowercase",
              fontSize: 14,
              color: "white",
            }}
          >
            {params?.row?.status}
          </Typography>
        </Button>
      );
    },
  },
];
export const truckCols = [
  {
    field: "code",
    headerName: "Mã code",
    sortable: false,
    pinnable: true,
    minWidth: 150,
    renderCell: (params) => {
      return (
        <Typography sx={{ color: AppColors.secondary, fontWeight: "500" }}>
          {params?.row?.code}
        </Typography>
      );
    },
  },
  {
    field: "capacity",
    headerAlign: "center",
    align: "center",
    headerName: "Trọng lượng chuyên chở (kg)",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} kg`;
    },
  },
  {
    field: "transportCostPerUnit",
    headerAlign: "center",
    align: "center",
    headerName: "Phí vận chuyển",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} đ`;
    },
  },
  {
    field: "waitingCost",
    headerAlign: "center",
    align: "center",
    headerName: "Phí chờ đợi",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} đ`;
    },
  },
  {
    field: "speed",
    headerAlign: "center",
    align: "center",
    headerName: "Vận tốc TB (m/s)",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} m/s`;
    },
  },
];
export const droneCols = [
  {
    field: "code",
    headerName: "Mã code",
    sortable: false,
    pinnable: true,
    minWidth: 150,
    renderCell: (params) => {
      return (
        <Typography sx={{ color: AppColors.secondary, fontWeight: "500" }}>
          {params?.row?.code}
        </Typography>
      );
    },
  },
  {
    field: "durationTime",
    headerAlign: "center",
    align: "center",
    headerName: "Thời gian hoạt động (s)",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} s`;
    },
  },
  {
    field: "capacity",
    headerAlign: "center",
    align: "center",
    headerName: "Trọng lượng chuyên chở (kg)",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} kg`;
    },
  },
  {
    field: "transportCostPerUnit",
    headerAlign: "center",
    align: "center",
    headerName: "Phí vận chuyển",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} đ`;
    },
  },
  {
    field: "waitingCost",
    headerAlign: "center",
    align: "center",
    headerName: "Phí chờ đợi",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} đ`;
    },
  },
  {
    field: "speed",
    headerAlign: "center",
    align: "center",
    headerName: "Vận tốc TB (m/s)",
    sortable: false,
    minWidth: 200,
    valueFormatter: (params) => {
      return `${params.value} m/s`;
    },
  },
];
export const deliveryBillCols = [
  {
    field: "code",
    headerName: "Mã code",
    sortable: false,
    pinnable: true,
    minWidth: 150,
    maxWidth: 200,
    renderCell: (params) => {
      return (
        <Typography sx={{ color: AppColors.secondary, fontWeight: "500" }}>
          {params?.row?.code}
        </Typography>
      );
    },
  },
  {
    field: "createdDate",
    headerAlign: "center",
    align: "center",
    headerName: "Thời điểm tạo",
    sortable: false,
    minWidth: 200,
    valueGetter: (params) => {
      return unix(params?.row?.createdDate).format("DD-MM-YYYY");
    },
  },
  {
    field: "deliveryDate",
    headerAlign: "center",
    align: "center",
    headerName: "Ngày giao hàng",
    sortable: false,
    minWidth: 200,
    valueGetter: (params) => {
      return unix(params?.row?.createdDate).format("DD-MM-YYYY");
    },
  },
  {
    field: "boughtBy",
    headerAlign: "center",
    align: "center",
    headerName: "Mua bởi",
    sortable: false,
    minWidth: 200,
    valueGetter: (params) => {
      return params?.row?.saleOrder?.customer?.name;
    },
  },
  {
    field: "facilty",
    headerAlign: "center",
    align: "center",
    headerName: "Kho trực thuộc",
    sortable: false,
    minWidth: 200,
    valueGetter: (params) => {
      return params?.row?.saleOrder?.customer?.facility?.name;
    },
  },
];
export const splittedBillCols = [
  {
    field: "code",
    headerName: "Mã code",
    sortable: false,
    pinnable: true,
    minWidth: 200,
    maxWidth: 300,
    renderCell: (params) => {
      return (
        <Typography sx={{ color: AppColors.secondary, fontWeight: "500" }}>
          {params?.row?.code}
        </Typography>
      );
    },
  },
  {
    field: "quantity",
    headerAlign: "center",
    align: "center",
    headerName: "Số lượng chia",
    sortable: false,
    pinnable: true,
    minWidth: 150,
  },
  {
    field: "deliveryBillItemSeqId",
    headerAlign: "center",
    align: "center",
    headerName: "Seq id",
    sortable: false,
    pinnable: true,
    minWidth: 150,
  },
  {
    field: "product",
    headerAlign: "center",
    align: "center",
    headerName: "Tên sản phẩm",
    sortable: false,
    pinnable: true,
    minWidth: 150,
  },
  {
    field: "deliveryBillCode",
    headerName: "Đơn gốc",
    headerAlign: "center",
    align: "center",
    sortable: false,
    pinnable: true,
    minWidth: 150,
    valueGetter: (params) => {
      return params?.row?.deliveryBill?.code;
    },
  },
];
