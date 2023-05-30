export const approver = {
  id: "MENU_WMSv2_APPROVER",
  icon: "DashboardIcon",
  text: "Giám đốc doanh nghiệp",
  child: [
    {
      id: "MENU_WMSv2_APPROVER.RECEIPTS",
      path: "/approver/receipts",
      isPublic: false,
      text: "Danh sách đơn xin nhập hàng",
      child: [],
    },
    {
      id: "MENU_WMSv2_APPROVER.REPORT",
      path: "/approver/report",
      isPublic: false,
      text: "Báo cáo",
      child: [],
    },
  ],
};
