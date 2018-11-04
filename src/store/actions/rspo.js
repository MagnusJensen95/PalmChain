import {
    SET_RSPO_ADMIN

} from "./types";

import consortiumDeployer from '../../utils/contractDeploymentInstance';
import web3 from '../../utils/getWeb3';
import consortiumInstance from '../../utils/consortiumInstance';





export const setRSPOAdministrator = name => {
    return {
        type: SET_RSPO_ADMIN,
        rspoAdministrator: name
    };
};

export const fetchRSPOAdministrator = () => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();

        let consortiumAddress = await consortiumDeployer.methods.getDeployedConsortiums().call({
            from: userAddress[0]
        })
        let firstConsortiumInstance = consortiumInstance(consortiumAddress[0]);
        let admin = await firstConsortiumInstance.methods.RSPOAdministrator().call({
            from: userAddress[0]
        })

        dispatch(setRSPOAdministrator(admin))
    }
}

export const approvePlantationRequest = (address) => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();

        let consortiumAddress = await consortiumDeployer.methods.getDeployedConsortiums().call({
            from: userAddress[0]
        })
        let firstConsortiumInstance = consortiumInstance(consortiumAddress[0]);
        let admin = await firstConsortiumInstance.methods.RSPOAdministrator().call({
            from: userAddress[0]
        })

        dispatch(setRSPOAdministrator(admin))
    }
}



