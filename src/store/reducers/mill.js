import {
  SET_MILL_ADDRESS,
  SET_MILL_PROPERTIES,
  SET_COTOKENS,
  RESET_MILL,
  SET_POSSIBLE_FFBTOKENS
} from "../actions/types";

const initialState = {
  millAddress: "",
  millName: "Test Mill",
  GPSLongitude: "Test GPSLongitude",
  GPSLatitude: "Test GPSLatitude",
  coTokens: [],
  possibleTokens: []
};

const MillReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MILL_ADDRESS: {
      return {
        ...state,
        millAddress: action.millAddress
      };
    }
    case SET_COTOKENS: {
      return {
        ...state,
        coTokens: action.coTokens
      };
    }
    case SET_POSSIBLE_FFBTOKENS: {
      return {
        ...state,
        possibleTokens: action.possibleTokens
      };
    }
    case RESET_MILL: {
      return initialState;
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
