import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';

const WarehouseList = () => {
    return (
        <div>
            WarehouseList
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(WarehouseList, SCR_ID, true);
