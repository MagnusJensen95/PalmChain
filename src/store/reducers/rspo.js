import { SET_RSPO_ADMIN } from "../actions/types";

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

        default:
            return state;
    }
};

export default RSPOReducer;
