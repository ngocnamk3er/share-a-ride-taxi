import React, { useRef, useEffect } from "react";
import Map from "./Map";
import ListItem from "./ListItem";

const RouteMap = ({ data }) => {
    return (
      <div>
        <Map data={data} />
        <div>
          {data.map(item => (
            <ListItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    );
  };

export default RouteMap;
