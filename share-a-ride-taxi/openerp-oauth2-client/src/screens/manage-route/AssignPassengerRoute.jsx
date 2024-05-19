import React, { useEffect, useState } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import { StandardTable } from "erp-hust/lib/StandardTable";
import { request } from "../../api";

const AssignPassengerRoute = () => {
    return (
        <div>
            AssignPassengerRoute
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";
export default withScreenSecurity(AssignPassengerRoute, SCR_ID, true);
