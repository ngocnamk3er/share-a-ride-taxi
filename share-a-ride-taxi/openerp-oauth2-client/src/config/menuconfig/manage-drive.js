export const MANAGE_DRIVE = {
  id: "MENU_SAR_MANAGE_DRIVE",
  icon: "DashboardIcon",
  text: "Manage drivers",
  child: [
    {
      id: "MENU_SAR_MANAGE_DRIVE.LIST_DRIVER",
      path: "/manage-drivers/list-drivers",
      isPublic: false,
      text: "List of drivers",
      child: [],
    },
    {
      id: "MENU_SAR_MANAGE_DRIVE.ASSIGN_ROUTE",
      path: "/manage-drivers/assign-route",
      isPublic: false,
      text: "Assign route",
      child: [],
    },
  ],

};
