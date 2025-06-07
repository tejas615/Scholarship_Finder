const scholarshipsReducer = (scholarships = [], action) => {
    switch(action.type) {
        case 'FETCH_ALL':
            return action.payload;
        case 'CREATE':
            return [scholarships,action.payload];
        case 'FETCH':
            return action.payload;
        default:
            return scholarships;
    }
};

export default scholarshipsReducer;