import {
    SET_AVAILABLE_CONSORTIUMS,
    SET_CURRENT_CONSORTIUM_ADDRESS
} from "../actions/types";

const initialState = {
    consortiumList: [],
    selectedAddress: ""
};

const ConsortiumListReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AVAILABLE_CONSORTIUMS: {
            return {
                ...state,
                consortiumList: action.consortiumList
            };
        }
        case SET_CURRENT_CONSORTIUM_ADDRESS: {
            return {
                ...state,
                selectedAddress: action.selectedAddress
            };
        }

        default:
            return state;
    }
};

export default ConsortiumListReducer;
