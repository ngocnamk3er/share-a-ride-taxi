export const user = {
  id: "MENU_USER",
  path: "",
  isPublic: false,
  icon: "PersonIcon",
  text: "Tài khoản",
  child: [
    {
      id: "MENU_USER_CREATE",
      path: "/userlogin/create",
      isPublic: false,
      icon: "StarBorder",
      text: "Tạo mới",
      child: [],
    },
    {
      id: "MENU_USER_LIST",
      path: "/userlogin/list",
      isPublic: false,
      icon: "StarBorder",
      text: "Danh sách",
      child: [],
    },
    {
      id: "MENU_USER_APPROVE_REGISTRATION",
      path: "/user-group/user/approve-register",
      isPublic: false,
      icon: "StarBorder",
      text: "Phê duyệt",
      child: [],
    },
    {
      id: "MENU_USER_SEND_MAIL_TO_USERS",
      path: "/user-group/user/send-mail",
      isPublic: false,
      icon: "StarBorder",
      text: "Gửi email",
      child: [],
    },
  ],
};
