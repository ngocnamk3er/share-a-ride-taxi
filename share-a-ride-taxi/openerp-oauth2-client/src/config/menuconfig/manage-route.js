export const MANAGE_ROUTE = {
  id: "MENU_SAR_MANAGE_DRIVE",
  icon: "RouteIcon",
  text: "Manage routes",
  child: [
    {
      id: "MENU_SAR_MANAGE_DRIVE.LIST_DRIVER",
      path: "/manage-routes/parcel-route-list",
      isPublic: false,
      text: "Route list for parcel",
      child: [],
    },
    {
      id: "MENU_SAR_MANAGE_DRIVE.LIST_DRIVER",
      path: "/manage-routes/assign-parcel-route",
      isPublic: false,
      text: "Create routes for parcel",
      child: [],
    },
    {
      id: "MENU_SAR_MANAGE_DRIVE.LIST_DRIVER",
      path: "/manage-routes/assign-passenger-route",
      isPublic: false,
      text: "Create routes for passenger",
      child: [],
    },
  ],
};
