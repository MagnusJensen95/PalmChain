import { SET_TOKENS_SUBMITTED, SET_PLANTATION_INFORMATION, SET_CURRENT_PLANTATION, RESET, RESET_PLANTATION } from "../actions/types";

const initialState = {
    plantationAddress: "",
    rspoAdminAssigned: "",
    plantationProperties: {},
    pendingRequests: [],
    tokensSubmitted: []

};

const PlantationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKENS_SUBMITTED: {
            return {
                ...state,
                tokensSubmitted: action.tokens
            };
        }
        case SET_PLANTATION_INFORMATION: {
            return {
                ...state,
                plantationProperties: action.plantationProperties
            };
        }
        case SET_CURRENT_PLANTATION: {
            return {
                ...state,
                plantationAddress: action.plantationAddress
            };
        }
        case RESET_PLANTATION: {
            return initialState;
        }

        default:
            return state;
    }
};

export default PlantationReducer;
