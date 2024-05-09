import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';

const EditWarehouse = () => {
    return (
        <div>
            EditWarehouse
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(EditWarehouse, SCR_ID, true);
