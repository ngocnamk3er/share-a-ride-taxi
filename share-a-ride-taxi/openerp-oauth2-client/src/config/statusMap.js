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
