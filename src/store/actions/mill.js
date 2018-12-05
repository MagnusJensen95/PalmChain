import { SET_MILL_ADDRESS, SET_MILL_PROPERTIES, SET_COTOKENS } from "./types";
import { consortiumInstance } from "../../utils/consortiumInstance";
import web3 from "../../utils/getWeb3";
import { mapToMill } from "../../utils/mappings";

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
      let token = await consortium.methods.COTokens(i).call({
        from: userAddress
      });
      console.log(token);
    }

    dispatch(setCoTokens(tokens));
  };
};

export const createCoToken = indexes => {
  return async (dispatch, getState) => {
    let consortiumAddress = getState().consortiumListReducer
      .selectedConsortiumAddress;
    let userAddress = getState().authenticationReducer.userAddress;

    let consortium = consortiumInstance(consortiumAddress);

    await consortium.methods.consumeFFBTokens(indexes).send({
      from: userAddress,
      gas: 4712388,
      gasPrice: 100000000000
    });

    dispatch(getCoTokensCreated());
  };
};
