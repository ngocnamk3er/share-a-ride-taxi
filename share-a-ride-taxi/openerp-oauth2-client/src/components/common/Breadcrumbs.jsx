import React from "react";
import Typography from "@mui/material/Typography";
import { Breadcrumbs as MUIBreadcrumbs } from "@mui/material";
import { withRouter, Link } from "react-router-dom";

const Breadcrumbs = (props) => {
  const {
    history,
    location: { pathname }
  } = props;

  const pathnames = pathname.split("/").filter((x) => x);

  return (
    <MUIBreadcrumbs aria-label="breadcrumb">
      <Link to="/" onClick={() => history.push("/")}>
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLastLink = index === pathnames.length - 1;
        return isLastLink ?
          <Typography key={name}>{name}</Typography> :
          <Link to={routeTo} key={name} onClick={() => history.push(routeTo)}>{name}</Link>;
      })}
    </MUIBreadcrumbs>
  );
};

export default withRouter(Breadcrumbs);
