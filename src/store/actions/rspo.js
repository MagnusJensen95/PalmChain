import { SET_RSPO_ADMIN } from "./types";

import { consortiumDeployer } from "../../utils/contractDeploymentInstance";
import web3 from "../../utils/getWeb3";
import { consortiumInstance } from "../../utils/consortiumInstance";
import { fetchPlantationInformation } from "./plantation";
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

export const approvePlantationRequest = plantationAddress => {
  return async (dispatch, getState) => {
    let user = getState().authenticationReducer.userAddress;
    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;

    let consortium = consortiumInstance(consortiumAddress);
    if (consortium === undefined) {
      return;
    }
    console.log(user);

    let rspoDude = await consortium.methods.RSPOAdministrator().call({
      from: user
    });
    console.log(rspoDude);
    let tx = await consortium.methods
      .approvePlantationRequest(plantationAddress)
      .send({
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
