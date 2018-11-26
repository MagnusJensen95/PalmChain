import { SET_MILL_ADDRESS, SET_MILL_PROPERTIES } from "../actions/types";

const initialState = {
  millAddress: "",
  millName: "Test Mill",
  GPSLongitude: "Test GPSLongitude",
  GPSLatitude: "Test GPSLatitude"
};

const MillReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MILL_ADDRESS: {
      return {
        ...state,
        millAddress: action.millAddress
      };
    }
    case SET_MILL_PROPERTIES: {
      return {
        ...state,
        GPSLatitude: action.GPSLatitude,
        GPSLongitude: action.GPSLongitude,
        millAddress: action.millAddress,
        millName: action.millName
      };
    }

    default:
      return state;
  }
};

export default MillReducer;
