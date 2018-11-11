import {
  SET_AUTHENTICATED_TYPE,
  AUTHENTICATE_USER,
  SET_ACCOUNTS_LIST,
  SET_USER_ADDRESS
} from "./types";

import web3 from "../../utils/getWeb3";
import consortiumInstance from "../../utils/consortiumInstance";
import {
  plantationOwner,
  unauthorizedUser,
  millOwner,
  rspoAdmin
} from "../models/authentication";
import { setRSPOAdministrator } from "./rspo";

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
    var nus = await web3.eth.getAccounts();

    dispatch(setAvailableAccounts(nus));
  };
};

export const authenticateUserAsType = (
  type,
  userAddress,
  consortiumAddress
) => {
  return async dispatch => {
    switch (type) {
      case plantationOwner:
        dispatch(authenticatePlantation(userAddress, consortiumAddress));
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

export const authenticatePlantation = (userAddress, consortiumAddress) => {
  return async dispatch => {
    let consortium = consortiumInstance(consortiumAddress);
    let registeredPlantation = await consortium.methods
      .registeredPlantations(userAddress)
      .call({
        from: userAddress
      });
    if (registeredPlantation) {
      dispatch(setAuthenticatedType(plantationOwner));
      dispatch(setUserAuthenticated(true));
    } else {
      dispatch(setAuthenticatedType(unauthorizedUser));
      dispatch(setUserAuthenticated(false));
    }
  };
};
export const authenticateRSPO = (userAddress, consortiumAddress) => {
  return async dispatch => {
    let consortium = consortiumInstance(consortiumAddress);

    let admin = await consortium.methods.RSPOAdministrator().call({
      from: userAddress
    });

    if (admin === userAddress) {
      dispatch(setAuthenticatedType(rspoAdmin));

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

    console.log(registeredMill);

    // if (activeMill) {
    //   dispatch(setAuthenticatedType(millOwner));
    //   dispatch(setUserAuthenticated(true));
    // } else {
    //   dispatch(setAuthenticatedType(unauthorizedUser));
    //   dispatch(setUserAuthenticated(false));
    // }
  };
};
