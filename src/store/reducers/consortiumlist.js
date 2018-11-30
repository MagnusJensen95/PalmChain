import {
  SET_AVAILABLE_CONSORTIUMS,
  SET_CURRENT_CONSORTIUM_ADDRESS,
  SET_CURRENT_CONSORTIUMDEPLOYER_ADDRESS,
  SET_AVAILABLE_PLANTATIONS,
  SET_PLANTATION_INFORMATION_LIST
} from "../actions/types";

const initialState = {
  consortiumList: [],
  plantationList: [],
  plantationObjects: [],
  selectedConsortiumAddress: "",
  consortiumDeployerAddress: ""
};

const ConsortiumListReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AVAILABLE_CONSORTIUMS: {
      return {
        ...state,
        consortiumList: action.consortiumList
      };
    }
    case SET_AVAILABLE_PLANTATIONS: {
      return {
        ...state,
        plantationList: action.plantationList
      };
    }

    case SET_PLANTATION_INFORMATION_LIST: {
      return {
        ...state,
        plantationObjects: action.plantationObjects
      };
    }
    case SET_CURRENT_CONSORTIUMDEPLOYER_ADDRESS: {
      return {
        ...state,
        consortiumDeployerAddress: action.consortiumDeployerAddress
      };
    }
    case SET_CURRENT_CONSORTIUM_ADDRESS: {
      return {
        ...state,
        selectedConsortiumAddress: action.selectedConsortiumAddress
      };
    }


    default:
      return state;
  }
};

export default ConsortiumListReducer;
