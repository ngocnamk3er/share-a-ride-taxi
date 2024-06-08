export const routeStatusMap = {
    0: "Not Ready",
    1: "Ready",
    2: "IN_TRANSIT",
    3: "Complete"
};

export const routeStatusMapReverse = {
    NotReady: 0,
    Ready: 1,
    IN_TRANSIT: 2,
    Complete: 3
};

export const getStatusColor = (statusId) => {
    switch (statusId) {
        case routeStatusMapReverse.NotReady:
            return 'gray';
        case routeStatusMapReverse.Ready:
            return 'blue';
        case routeStatusMapReverse.IN_TRANSIT:
            return 'orange';
        case routeStatusMapReverse.Complete:
            return 'green';
        default:
            return 'black';
    }
};

export const requestStatusMap = {
    0: "RECEIVED",
    1: "DRIVER_ASSIGNED",
    2: "IN_TRANSIT",
    3: "DELIVERED",
    4: "CANCALLED"
};

export const requestStatusMapReverse = {
    RECEIVED: 0,
    DRIVER_ASSIGNED: 1,
    IN_TRANSIT: 2,
    DELIVERED: 3,
    CANCALLED: 4
};

export const getRequestStatusColor = (statusId) => {
    switch (statusId) {
        case requestStatusMapReverse.RECEIVED:
            return 'gray'; // gray
        case requestStatusMapReverse.DRIVER_ASSIGNED:
            return 'blue'; // blue
        case requestStatusMapReverse.IN_TRANSIT:
            return 'orange'; // orange
        case requestStatusMapReverse.DELIVERED:
            return 'green'; // green
        case requestStatusMapReverse.CANCALLED:
            return 'red'; // red
        default:
            return 'black'; // 
    }
};

