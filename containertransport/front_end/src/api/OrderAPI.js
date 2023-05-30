import { request } from "api";

export const getOrders = async (data) => {
    const resData = request(
        "post",
        "/order/", {}, {}, data, {},
    );
    return resData;
}

export const createOrder = async (data) => {
    const resData = request(
        "post",
        `/order/create`, {}, {}, data
    );
    return resData;
}
