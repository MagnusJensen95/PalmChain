import {
  SET_TOKENS_SUBMITTED,
  SET_CURRENT_PLANTATION,
  SET_PLANTATION_INFORMATION
} from "./types";

import { consortiumDeployer } from "../../utils/contractDeploymentInstance";
import { plantationInstance } from "../../utils/plantationInstance";
import { mapToPlantation, isZeroAddress, mapToFFBToken } from "../../utils/mappings";

export const setTokensSubmittedFromPlantation = tokens => {
  return {
    type: SET_TOKENS_SUBMITTED,
    tokens: tokens
  };
};

export const setSelectedPlantation = plantationAddress => {
  return {
    type: SET_CURRENT_PLANTATION,
    plantationAddress: plantationAddress
  };
};

export const setPlantationProperties = plantationProperties => {
  return {
    type: SET_PLANTATION_INFORMATION,
    plantationProperties: plantationProperties
  };
};

//fetch tokens submitted by this plantation
export const fetchTokensSubmitted = address => {
  return async dispatch => { };
};

//Fetch plantation address belonging to currently signed in user (if he is owner of a plantation)
export const identifyPlantationAddressByOwner = (
  userAddress,
  deployerAddress
) => {
  return async dispatch => {
    let deployer = consortiumDeployer(deployerAddress);
    if (deployer === undefined) {
      return;
    }

    let plantationAddress = await deployer.methods
      .plantationOwnerRelation(userAddress)
      .call({
        from: userAddress
      });

    if (isZeroAddress(plantationAddress)) {
      dispatch(setPlantationProperties({}));
      return;
    }
    let plantation = plantationInstance(plantationAddress);

    let information = await plantation.methods.getPlantationInformation().call({
      from: userAddress
    });
    information["address"] = plantationAddress;

    information = mapToPlantation(information);

    dispatch(setPlantationProperties(information));
    dispatch(setSelectedPlantation(plantationAddress));
  };
};

//Fetch whether plantation is approved or pending approvel / has not sent approval request.
export const fetchPlantationInformation = (plantationAddress, userAddress) => {
  return async dispatch => {
    let plantation = plantationInstance(plantationAddress);
    let information = await plantation.methods.getPlantationInformation().call({
      from: userAddress
    });
    information["address"] = plantationAddress;

    information = mapToPlantation(information);

    dispatch(setPlantationProperties(information));
  };
};

//Submit ffb token from selected user address
export const submitFFBToken = (weight, date) => {
  return async (dispatch, getState) => {

    let plantationAddress = getState().plantationReducer.plantationAddress;
    let userAddress = getState().authenticationReducer.userAddress;

    let plantation = plantationInstance(plantationAddress);

    await plantation.methods.submitFFBToken(weight, date).send({
      from: userAddress,
      gas: 4712388,
      gasPrice: 100000000000
    });


    let amount = await plantation.methods.getTokenAmount().call({
      from: userAddress
    })

    let tokenCollection = [];
    for (let i = 0; i < amount; i++) {
      let token = await plantation.methods.FFBTokens(i).call({
        from: userAddress
      })
      token = mapToFFBToken(token);

      tokenCollection.push(token);
    }

    dispatch(setTokensSubmittedFromPlantation(tokenCollection))




  }
};

export const requestConsortiumApproval = (plantationAddress, userAddress) => {
  return async dispatch => {
    let plantation = plantationInstance(plantationAddress);
    if (plantation._address === null) {
      alert("you do not have a plantation assigned yet");
      return;
    }
    plantation.methods.requestPlantationSubscription().send({
      from: userAddress,
      gas: 4712388,
      gasPrice: 100000000000
    });

    dispatch(fetchPlantationInformation(plantationAddress));
  };
};
