import {
    SET_AUTHENTICATED_TYPE,
    AUTHENTICATE_USER
} from "./types";

import consortiumDeployer from '../../utils/contractDeploymentInstance';
import web3 from '../../utils/getWeb3';
import consortiumInstance from '../../utils/consortiumInstance';
import { plantationOwner, unauthorizedUser } from "../models/authentication";





export const setAuthenticatedType = type => {
    return {
        type: SET_AUTHENTICATED_TYPE,
        authType: type
    };
};

export const setUserAuthenticated = authenticated => {
    return {
        type: AUTHENTICATE_USER,
        authorized: authenticated
    };
};

export const authenticatePlantation = (address, consortiumInstanceIndex) => {
    return async dispatch => {


        let consortiumAddress = await consortiumDeployer.methods.getDeployedConsortiums().call({
            from: address
        })
        let consortiumInstance = consortiumInstance(consortiumAddress[consortiumInstanceIndex]);
        let registeredPlantation = await firstConsortiumInstance.methods.registeredPlantations(address).call({
            from: address
        })
        if (registeredPlantation) {
            dispatch(setAuthenticatedType(plantationOwner))
            dispatch(setUserAuthenticated(true))
        }
        else {
            dispatch(setAuthenticatedType(unauthorizedUser))
            dispatch(setUserAuthenticated(false))
        }

    }
}
export const authenticateRSPO = address => {
    return async dispatch => {


        let consortiumAddress = await consortiumDeployer.methods.getDeployedConsortiums().call({
            from: address
        })
        let firstConsortiumInstance = consortiumInstance(consortiumAddress[0]);
        let admin = await firstConsortiumInstance.methods.RSPOAdministrator().call({
            from: userAddress[0]
        })

        dispatch(setRSPOAdministrator(admin))
    }
}
export const authenticateMill = address => {
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


