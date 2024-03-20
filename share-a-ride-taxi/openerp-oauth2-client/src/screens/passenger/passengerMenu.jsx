import React from 'react'
import withScreenSecurity from 'components/common/withScreenSecurity';

const passengerMenu = () => {
    return (
        <div>passengerMenu</div>
    )
}

const SCR_ID = "SCR_SAR_PASSENGER";
export default withScreenSecurity(passengerMenu, SCR_ID, true);
