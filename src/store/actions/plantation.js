import {
    SET_TOKENS_SUBMITTED,
    SET_CURRENT_PLANTATION

} from "./types";


import consortiumDeployer from '../../utils/contractDeploymentInstance';
import web3 from '../../utils/getWeb3';
import consortiumInstance from '../../utils/consortiumInstance';





export const setTokensSubmittedFromPlantation = tokens => {
    return {
        type: SET_TOKENS_SUBMITTED,
        tokens: tokens
    };
};

export const setSelectedPlantation = plantationAddress => {
    return {
        type: SET_CURRENT_PLANTATION,
        selectedPlantation: plantationAddress
    };
};

//fetch tokens submitted by this plantation
export const fetchTokensSubmitted = (address) => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();
        let deployer = consortiumDeployer();
        if (deployer === undefined) {
            return;
        }
        let consortiumAddress = await deployer.methods.getDeployedConsortiums().call({
            from: userAddress[0]
        })
        let firstConsortiumInstance = consortiumInstance(consortiumAddress[0]);
        let admin = await firstConsortiumInstance.methods.RSPOAdministrator().call({
            from: userAddress[0]
        })

        dispatch(setRSPOAdministrator(admin))
    }
}

//Fetch whether plantation is approved or pending approvel / has not sent approval request. 
export const fetchIsPlantationApproved = (address) => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();
        let deployer = consortiumDeployer();
        if (deployer === undefined) {
            return;
        }
        let consortiumAddress = await deployer.methods.getDeployedConsortiums().call({
            from: userAddress[0]
        })
        let firstConsortiumInstance = consortiumInstance(consortiumAddress[0]);
        let admin = await firstConsortiumInstance.methods.RSPOAdministrator().call({
            from: userAddress[0]
        })

        dispatch(setRSPOAdministrator(admin))
    }
}


//Submit ffb token from selected user address
export const submitFFBToken = (token, userAddress) => {
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

