import { SET_RSPO_ADMIN } from "./types";
import { consortiumInstance } from "../../utils/consortiumInstance";

import { fetchPlantationAddresses } from "./consortiumlist";

export const setRSPOAdministrator = name => {
  return {
    type: SET_RSPO_ADMIN,
    rspoAdministrator: name
  };
};

export const fetchRSPOAdministrator = consortiumAddress => {
  return async (dispatch, getState) => {
    let userAddress = getState().authenticationReducer.userAddress;

    let consortiumInstanceSelected = consortiumInstance(consortiumAddress);
    let admin = await consortiumInstanceSelected.methods
      .RSPOAdministrator()
      .call({
        from: userAddress
      });

    dispatch(setRSPOAdministrator(admin));
  };
};

export const revokePlantationAccess = plantationAddress => {
  return async (dispatch, getState) => {
    let rspoAddress = getState().rspoReducer.rspoAdministrator;
    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;
    let consortiumDeployerAddress = getState().consortiumListReducer
      .consortiumDeployerAddress;

    let consortiumInstanceSelected = consortiumInstance(consortiumAddress);
    let admin = await consortiumInstanceSelected.methods
      .revokePlantationAccess(plantationAddress)
      .send({
        from: rspoAddress,
        gas: 4712388,
        gasPrice: 100000000000
      });
    dispatch(
      fetchPlantationAddresses(
        consortiumDeployerAddress,
        consortiumAddress,
        rspoAddress
      )
    );
  };
};

export const approvePlantationRequest = plantationAddress => {
  return async (dispatch, getState) => {
    let user = getState().authenticationReducer.userAddress;
    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;

    let consortium = consortiumInstance(consortiumAddress);
    if (consortium === undefined) {
      return;
    }

    await consortium.methods.RSPOAdministrator().call({
      from: user
    });

    await consortium.methods.approvePlantationRequest(plantationAddress).send({
      from: user,
      gas: 4712388,
      gasPrice: 100000000000
    });

    let deployerAddress = getState().consortiumListReducer
      .consortiumDeployerAddress;

    dispatch(
      fetchPlantationAddresses(deployerAddress, consortiumAddress, user)
    );
  };
};
