import {
  SET_MILL_ADDRESS,
  SET_MILL_PROPERTIES,
  SET_COTOKENS,
  SET_POSSIBLE_FFBTOKENS
} from "./types";
import { consortiumInstance } from "../../utils/consortiumInstance";
import web3 from "../../utils/getWeb3";
import { mapToMill, mapToCOToken } from "../../utils/mappings";

export const setMillAddressLocal = address => {
  return {
    type: SET_MILL_ADDRESS,
    millAddress: address
  };
};

export const setCoTokens = tokens => {
  return {
    type: SET_COTOKENS,
    coTokens: tokens
  };
};

export const setPossibleTokens = tokens => {
  return {
    type: SET_POSSIBLE_FFBTOKENS,
    possibleTokens: tokens
  };
};

export const setMillProperties = mill => {
  return {
    type: SET_MILL_PROPERTIES,
    GPSLatitude: mill.GPSLatitude,
    GPSLongitude: mill.GPSLongitude,
    millAddress: mill.millAddress,
    millName: mill.millName
  };
};

export const fetchPossibleTokens = () => {
  return async (dispatch, getState) => {
    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;

    let userAddress = getState().authenticationReducer.userAddress;
    let consortium = consortiumInstance(consortiumAddress);

    let result = await consortium.methods.getUnprocessedTokenIndexes().call({
      from: userAddress
    });

    for (let element of result) {
      element = parseInt(element);
    }

    dispatch(setPossibleTokens(result));
  };
};

export const fetchCurrentMillAddress = consortiumAddress => {
  return async (dispatch, getState) => {
    let consortium = consortiumInstance(consortiumAddress);
    let userAddress = getState().authenticationReducer.userAddress;

    let mill = await consortium.methods.activeMill().call({
      from: userAddress
    });

    mill = mapToMill(mill);

    dispatch(setMillProperties(mill));
  };
};

export const setMillAddress = address => {
  return async (dispatch, getState) => {
    if (!web3.utils.isAddress(address)) {
      alert("Given mill address is not a valid ethereum address");
      return;
    }
    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;
    let userAddress = getState().authenticationReducer.userAddress;

    let millProps = { ...getState().millReducer };

    let consortium = consortiumInstance(consortiumAddress);

    await consortium.methods
      .setMill(
        millProps.GPSLongitude,
        millProps.GPSLatitude,
        millProps.millName,
        address
      )
      .send({
        from: userAddress,
        gas: 4712388,
        gasPrice: 100000000000
      });

    dispatch(fetchCurrentMillAddress(consortiumAddress));
  };
};

export const getCoTokensCreated = () => {
  return async (dispatch, getState) => {
    let tokens = [];

    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;
    let userAddress = getState().authenticationReducer.userAddress;

    let consortium = consortiumInstance(consortiumAddress);
    let amount = await consortium.methods.getCoTokenAmount().call({
      from: userAddress
    });

    let tokenCollection = [];
    for (let i = 0; i < amount; i++) {
      let token = await consortium.methods.getCoTokenAtIndex(i).call({
        from: userAddress
      });
      token = mapToCOToken(token);
      tokenCollection.push(token);
    }

    dispatch(setCoTokens(tokenCollection));
  };
};

export const createCoToken = (length, map) => {
  return async (dispatch, getState) => {
    let possibleTokens = getState().millReducer.possibleTokens;

    let indexArray = [];
    console.log(length);
    console.log(map);
    for (let i = 0; i < length; i++) {
      if (map.get(possibleTokens[i])) {
        indexArray.push(possibleTokens[i]);
      }
    }
    console.log(indexArray);
    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;
    let userAddress = getState().authenticationReducer.userAddress;

    let consortium = consortiumInstance(consortiumAddress);

    await consortium.methods.consumeFFBTokens(indexArray).send({
      from: userAddress,
      gas: 4712388,
      gasPrice: 100000000000
    });

    dispatch(getCoTokensCreated());
    dispatch(fetchPossibleTokens());
  };
};
