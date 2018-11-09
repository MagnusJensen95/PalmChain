import Web3 from "web3";

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

//const web3 = new Web3(window.web3.currentProvider);
export default web3; 