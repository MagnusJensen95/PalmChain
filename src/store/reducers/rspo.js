import { SET_RSPO_ADMIN, RESET_RSPO } from "../actions/types";

const initialState = {
    rspoAdministrator: ""
};

const RSPOReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_RSPO_ADMIN: {
            return {
                ...state,
                rspoAdministrator: action.rspoAdministrator
            };
        }
        case RESET_RSPO: {
            return initialState;
        }
        default:
            return state;
    }
};

export default RSPOReducer;
