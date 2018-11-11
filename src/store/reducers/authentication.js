import {
  SET_AUTHENTICATED_TYPE,
  AUTHENTICATE_USER,
  SET_ACCOUNTS_LIST,
  SET_USER_ADDRESS
} from "../actions/types";
import { unauthorizedUser } from "../models/authentication";

const initialState = {
  authType: unauthorizedUser,
  authorized: false,
  accounts: [],
  userAddress: ""
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
        authorized: action.authorized
      };
    }
    case SET_ACCOUNTS_LIST: {
      return {
        ...state,
        accounts: action.accounts
      };
    }
    case SET_USER_ADDRESS: {
      return {
        ...state,
        userAddress: action.userAddress
      };
    }

    default:
      return state;
  }
};

export default AuthenticationReducer;
