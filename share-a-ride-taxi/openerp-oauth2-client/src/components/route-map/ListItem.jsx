import React from "react";

const ListItem = ({ item }) => {
    return (
        <div>
            <p>Passenger Name: {item.passengerName}</p>
            <p>Pickup Location: {item.pickupLocationAddress}</p>
            <p>Dropoff Location: {item.dropoffLocationAddress}</p>
            <p>Request Time: {item.requestTime}</p>
        </div>
    );
};

export default ListItem;
