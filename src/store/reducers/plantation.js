import {

} from "../actions/types";

const initialState = {
    plantationSelected,
    rspoAdminAssigned,
    plantationProperties,
    pendingRequests

};

const PlantationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AVAILABLE_CONSORTIUMS: {
            return {
                ...state,
                consortiumList: action.consortiumList
            };
        }


        default:
            return state;
    }
};

export default PlantationReducer;
