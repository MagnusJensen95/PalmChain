import Plantation from "../contracts/Plantation.json";


import web3 from './getWeb3';


const plantationInstance = (address) => {
    if (address === undefined) {
        return;
    }

    let contract = new web3.eth.Contract(Plantation.abi, address)


    return contract;
}

export default plantationInstance;