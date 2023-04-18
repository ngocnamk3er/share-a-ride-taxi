import {TabScrollButton} from "@material-ui/core";
import {grey} from "@material-ui/core/colors";
import {withStyles} from "@material-ui/core/styles";

export const AntScrollButton = withStyles((theme) => ({
  root: {
    opacity: 1,
    position: "absolute",
    height: 36,
    width: 36,
    marginTop: 6,
    borderRadius: "50%",
    backgroundColor: grey[200],
    overflow: "hidden",
    "&.MuiTabs-scrollButtons": {
      "&:hover": { backgroundColor: "#ffffff" },
      "&:first-of-type": { zIndex: 1 },
      "&:last-of-type": { right: 0 },
    },

    // Another way to fix scroll button
    // transition: "width 0.5s",
    // "&.Mui-disabled": {
    //   width: 0,
    // },
  },
}))(TabScrollButton);
