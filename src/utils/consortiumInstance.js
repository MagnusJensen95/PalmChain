import Consortium from "../contracts/Consortium.json";


import web3 from './getWeb3';


const consortiumInstance = (address) => {
    return new web3.eth.Contract(Consortium.abi, address)
}

export default consortiumInstance;