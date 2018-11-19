import Consortium from "../contracts/Consortium.json";


import web3 from './getWeb3';


const consortiumInstance = (address) => {
    if (address === undefined) {
        return;
    }

    let contract = new web3.eth.Contract(Consortium.abi, address)
    contract.events.PlantationSubmissionRequested({
        fromBlock: 0
    }, function (error, event) { console.log(event); })
        .on('data', function (event) {
            console.log("event"); // same results as the optional callback above
        })
        .on('changed', function (event) {
            // remove event from local database
        })
        .on('error', "console.error");

    return contract;
}

export default consortiumInstance;