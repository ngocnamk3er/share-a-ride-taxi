import React, { useState, useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';

const DetailWareHouse = () => {
    return (
        <div>
            DetailWareHouse
        </div>
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailWareHouse, SCR_ID, true);
