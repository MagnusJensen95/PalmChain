import {
  SET_TOKENS_SUBMITTED,
  SET_CURRENT_PLANTATION,
  SET_PLANTATION_INFORMATION
} from "./types";

import { consortiumDeployer } from "../../utils/contractDeploymentInstance";
import { plantationInstance } from "../../utils/plantationInstance";
import {
  mapToPlantation,
  isZeroAddress,
  mapToFFBToken
} from "../../utils/mappings";
import { consortiumInstance } from "../../utils/consortiumInstance";

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

export const setPlantationName = newName => {
  return async (dispatch, getState) => {
    let plantationAddress = getState().plantationReducer.plantationAddress;
    let userAddress = getState().authenticationReducer.userAddress;

    let plantation = plantationInstance(plantationAddress);

    await plantation.methods.setPlantationName(newName).send({
      from: userAddress,
      gas: 4712388,
      gasPrice: 100000000000
    });

    dispatch(fetchPlantationInformation(plantationAddress, userAddress));
  };
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
    dispatch(fetchTokensSubmitted());
  };
};

//Fetch wether plantation is approved or pending approvel / has not sent approval request.
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
    let plantationAddress = getState().plantationReducer.plantationProperties.address;
    let userAddress = getState().authenticationReducer.userAddress;

    let plantation = plantationInstance(plantationAddress);

    await plantation.methods.submitFFBToken(weight, date).send({
      from: userAddress,
      gas: 4712388,
      gasPrice: 100000000000
    });

    dispatch(fetchTokensSubmitted());
  };
};

//fetch tokens submitted by this plantation
export const fetchTokensSubmitted = () => {
  return async (dispatch, getState) => {
    let plantationAddress = getState().plantationReducer.plantationAddress;
    let userAddress = getState().authenticationReducer.userAddress;

    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;

    let consortiumInstanceSelected = consortiumInstance(consortiumAddress);
    if (isZeroAddress(plantationAddress)) {
      return;
    }
    let plantation = plantationInstance(plantationAddress);

    let amount = await plantation.methods.getTokenAmount().call({
      from: userAddress
    });

    let tokenIndexes = await plantation.methods.getTokenIds().call({
      from: userAddress
    });


    let parsedIndexes = [];

    for (let index of tokenIndexes) {
      parsedIndexes.push(parseInt(index))
    }

    let tokenCollection = [];
    for (let i = 0; i < parsedIndexes.length; i++) {
      let token = await consortiumInstanceSelected.methods.FFBTokens(parsedIndexes[i]).call({
        from: userAddress
      });
      token = mapToFFBToken(token);

      tokenCollection.push(token);
    }

    dispatch(setTokensSubmittedFromPlantation(tokenCollection));
  };
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
