export const routeStatusMap = {
    0: "Not Ready",
    1: "Ready",
    2: "IN_TRANSIT",
    3: "Complete"
};

export const getStatusColor = (statusId) => {
    switch (statusId) {
        case 0:
            return 'gray'; // Not Ready
        case 1:
            return 'blue'; // Ready
        case 2:
            return 'orange'; // In Transit
        case 3:
            return 'green'; // Complete
        default:
            return 'gray';
    }
};

