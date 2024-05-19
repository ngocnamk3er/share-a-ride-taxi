import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";

const AssignParcelRoute = () => {
    return (
        <div>
            AssignParcelRoute
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(AssignParcelRoute, SCR_ID, true);
