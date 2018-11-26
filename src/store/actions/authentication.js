import {
  SET_AUTHENTICATED_TYPE,
  AUTHENTICATE_USER,
  SET_ACCOUNTS_LIST,
  SET_USER_ADDRESS,
  RESET
} from "./types";

import web3 from "../../utils/getWeb3";
import { consortiumInstance } from "../../utils/consortiumInstance";
import {
  plantationOwner,
  unauthorizedUser,
  millOwner,
  rspoAdmin
} from "../models/authentication";
import { setRSPOAdministrator } from "./rspo";
import { fetchPlantationAddresses, setPlantationList } from "./consortiumlist";
import { identifyPlantationAddressByOwner, setPlantationProperties } from "./plantation";

export const setAuthenticatedType = type => {
  return {
    type: SET_AUTHENTICATED_TYPE,
    authType: type
  };
};

export const setAvailableAccounts = accounts => {
  return {
    type: SET_ACCOUNTS_LIST,
    accounts: accounts
  };
};

export const setUserAuthenticated = authorized => {
  return {
    type: AUTHENTICATE_USER,
    authorized: authorized
  };
};

export const setCurrentUserAddress = address => {
  return {
    type: SET_USER_ADDRESS,
    userAddress: address
  };
};
export const fetchAvailableAccounts = () => {
  return async dispatch => {
    var accounts = await web3.eth.getAccounts();

    dispatch(setAvailableAccounts(accounts));
  };
};

export const signUserOut = () => {
  return dispatch => {
    dispatch(setCurrentUserAddress(""));
    dispatch(setUserAuthenticated(false));
    dispatch(setAuthenticatedType(unauthorizedUser));
    dispatch({ type: RESET });

  };
};

export const authenticateUserAsType = (
  type,
  userAddress,
  consortiumAddress,
  deployerAddress
) => {
  return async (dispatch, getState) => {
    switch (type) {
      case plantationOwner:
        dispatch(
          authenticatePlantation(
            userAddress,
            consortiumAddress,
            deployerAddress
          )
        );
        break;
      case millOwner:
        dispatch(authenticateMill(userAddress, consortiumAddress));
        break;
      case rspoAdmin:
        dispatch(authenticateRSPO(userAddress, consortiumAddress));

        break;
      default:
    }
  };
};

export const authenticatePlantation = (
  userAddress,
  consortiumAddress,
  deployerAddress
) => {
  return async dispatch => {
    dispatch(setAuthenticatedType(plantationOwner));
    dispatch(setUserAuthenticated(true));
    dispatch(identifyPlantationAddressByOwner(userAddress, deployerAddress));

    //Everyone is able to sign is as plantation owner, might not be able to see any plantations.
    // let consortium = consortiumInstance(consortiumAddress);
    // let registeredPlantation = await consortium.methods
    //   .registeredPlantations(userAddress)
    //   .call({
    //     from: userAddress
    //   });
    // if (registeredPlantation) {
    //  //
    // } else {
    //   dispatch(setAuthenticatedType(unauthorizedUser));
    //   dispatch(setUserAuthenticated(false));
    // }
  };
};
export const authenticateRSPO = (userAddress, consortiumAddress) => {
  return async (dispatch, getState) => {
    let consortium = consortiumInstance(consortiumAddress);

    let admin = await consortium.methods.RSPOAdministrator().call({
      from: userAddress
    });

    if (admin === userAddress) {
      dispatch(setAuthenticatedType(rspoAdmin));
      dispatch(
        fetchPlantationAddresses(
          getState().consortiumListReducer.consortiumDeployerAddress,
          consortiumAddress,
          admin
        )
      );
      dispatch(setUserAuthenticated(true));
    } else {
      dispatch(setAuthenticatedType(unauthorizedUser));
      dispatch(setUserAuthenticated(false));
    }
    dispatch(setRSPOAdministrator(admin));
  };
};

export const authenticateMill = (userAddress, consortiumAddress) => {
  return async dispatch => {
    let consortium = consortiumInstance(consortiumAddress);
    let registeredMill = await consortium.methods.activeMill().call({
      from: userAddress
    });

    // if (activeMill) {
    //   dispatch(setAuthenticatedType(millOwner));
    //   dispatch(setUserAuthenticated(true));
    // } else {
    //   dispatch(setAuthenticatedType(unauthorizedUser));
    //   dispatch(setUserAuthenticated(false));
    // }
  };
};
