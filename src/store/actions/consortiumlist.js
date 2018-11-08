import {
    SET_AVAILABLE_CONSORTIUMS,
    SET_CURRENT_CONSORTIUM_ADDRESS

} from "./types";

import consortiumDeployer from '../../utils/contractDeploymentInstance';
import web3 from '../../utils/getWeb3';
import consortiumInstance from '../../utils/consortiumInstance';





export const setAvaibleConsortiumList = list => {
    return {
        type: SET_AVAILABLE_CONSORTIUMS,
        consortiumList: list
    };
};

export const setSelectedConsortiumAddress = address => {
    return {
        type: SET_CURRENT_CONSORTIUM_ADDRESS,
        selectedAddress: address
    };
};


export const fetchConsortiumAddresses = address => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();

        let consortiumAddresses = await consortiumDeployer.methods.getDeployedConsortiums().call({
            from: address
        })


        dispatch(setAvaibleConsortiumList(consortiumAddresses))
    }
}


