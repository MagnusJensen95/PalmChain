import Consortium from "../contracts/Consortium.json";

import web3 from "./getWeb3";

export const consortiumInstance = address => {
  if (address === undefined) {
    return;
  }

  let contract = new web3.eth.Contract(Consortium.abi, address);


  return contract;
};
