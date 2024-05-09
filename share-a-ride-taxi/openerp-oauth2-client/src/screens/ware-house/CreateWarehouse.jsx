import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';

const CreateWarehouse = () => {
    return (
        <div>
            CreateWarehouse
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(CreateWarehouse, SCR_ID, true);
