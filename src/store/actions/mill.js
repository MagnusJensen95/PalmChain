import { SET_MILL_ADDRESS, SET_MILL_PROPERTIES } from "./types";
import { consortiumInstance } from "../../utils/consortiumInstance";
import web3 from "../../utils/getWeb3";
import { mapToMill } from "../../utils/mappings";

export const setMillAddressLocal = address => {
  return {
    type: SET_MILL_ADDRESS,
    millAddress: address
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
