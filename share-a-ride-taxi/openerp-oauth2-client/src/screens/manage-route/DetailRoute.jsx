import React, { useEffect } from "react";
import withScreenSecurity from 'components/common/withScreenSecurity';
import './AddRequestToRoute.css';
import { useParams } from "react-router-dom";
import { request } from "../../api";
import RoutingMapTwoPoint from '../../components/findroute/RoutingMapTwoPoint';


const DetailRoute = () => {
    const { routeId } = useParams();
    const currentPassengerRequest = []
    // const listLocation = [{lat: 19,lon: 105},{lat: 29,lon: 115}]
    const listLocation = []
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRouteDetail = await request("get", `/route-details/search?routeId=${routeId}`)
                const routeDetail = resRouteDetail.data
                const resPassengerRequest = await request("get", `/passenger-requests`)
                const passengerRequest = resPassengerRequest.data
                for (let j = 0; j < routeDetail.length; j++) {
                    console.log(passengerRequest)
                    for (let i = 0; i < passengerRequest.length; i++) {
                        if (routeDetail[j].requestId === passengerRequest[i].id) {
                            currentPassengerRequest.push(passengerRequest[i]);
                            listLocation.push({ lat: passengerRequest[i].pickupLocationLatitude, lon: passengerRequest[i].pickupLocationLongitude })
                        }
                    }
                }

                // console.log(JSON.stringify(currentPassengerRequest));
                // console.log(JSON.stringify("listLocation"));
                // console.log(JSON.stringify(listLocation));

            } catch (error) {
                console.log(error)
            }
        };

        fetchData();
    }, [routeId]);
    return (
        <RoutingMapTwoPoint style={{ width: "100%", height: "80vh" }} listLocation={listLocation} />
    );
}

const SCR_ID = "SCR_SAR_DEFAULT";

export default withScreenSecurity(DetailRoute, SCR_ID, true);


