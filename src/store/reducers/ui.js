import { SET_DRAWER_STATE } from "../actions/types";

const initialState = {
  drawerStatus: false
};

const UIReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DRAWER_STATE: {
      return {
        ...state,
        drawerStatus: action.drawerStatus
      };
    }

    default:
      return state;
  }
};

export default UIReducer;
