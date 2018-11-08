import { SET_AUTHENTICATED_TYPE, AUTHENTICATE_USER } from "../actions/types";
import { millOwner, rspoAdmin, plantationOwner, unauthorizedUser } from "../models/authentication";

const initialState = {
    authType: unauthorizedUser,
    authorized: false
};

const AuthenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_AUTHENTICATED_TYPE: {
            return {
                ...state,
                authType: action.authType
            };
        }
        case AUTHENTICATE_USER: {
            return {
                ...state,
                authorized: action.authenticated
            };
        }

        default:
            return state;
    }
};

export default AuthenticationReducer;
