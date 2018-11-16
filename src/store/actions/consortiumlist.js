import {
    SET_AVAILABLE_CONSORTIUMS,
    SET_CURRENT_CONSORTIUM_ADDRESS,
    SET_CURRENT_CONSORTIUMDEPLOYER_ADDRESS,
    SET_AVAILABLE_PLANTATIONS

} from "./types";

import { consortiumDeployer, deployNewConsortiumDeployer } from '../../utils/contractDeploymentInstance';
import web3 from '../../utils/getWeb3';
import consortiumInstance from "../../utils/consortiumInstance";






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

export const setConsortiumDeployerAddress = address => {
    return {
        type: SET_CURRENT_CONSORTIUMDEPLOYER_ADDRESS,
        consortiumDeployerAddress: address
    };
};

export const setPlantationList = list => {
    return {
        type: SET_AVAILABLE_PLANTATIONS,
        plantationList: list
    };
}


export const fetchConsortiumAddresses = address => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();
        let deployer = consortiumDeployer(address);
        if (deployer === undefined) {
            return;
        }
        let consortiumAddresses = await deployer.methods.getDeployedConsortiums().call({
            from: address
        })


        dispatch(setAvaibleConsortiumList(consortiumAddresses))
    }
}

export const fetchPlantationAddresses = address => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();
        let deployer = consortiumDeployer(address);
        if (deployer === undefined) {
            return;
        }
        let consortiumAddresses = await deployer.methods.getDeployedPlantations().call({
            from: address
        })


        dispatch(setPlantationList(consortiumAddresses))
    }
}


export const deployNewConsortiumDeployerAction = () => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();
        userAddress = userAddress[0];
        let deployer = await deployNewConsortiumDeployer(userAddress);


        dispatch(setConsortiumDeployerAddress(deployer));
    }
}


export const deployConsortium = (deployerAddress) => {
    return async dispatch => {
        let userAddress = await web3.eth.getAccounts();
        userAddress = userAddress[0];
        let contract = await consortiumDeployer(deployerAddress);
        await contract.methods.createConsortium().send({
            from: userAddress,
            gas: 4712388,
            gasPrice: 100000000000
        })



        dispatch(fetchConsortiumAddresses(deployerAddress));
    }
}

export const deployPlantation = (deployerAddress, consortiumAddress, rspoAddress) => {
    return async dispatch => {

        let contract = await consortiumDeployer(deployerAddress);
        await contract.methods.createPlantation(consortiumAddress, rspoAddress).send({
            from: rspoAddress,
            gas: 4712388,
            gasPrice: 100000000000
        })



        dispatch(fetchPlantationAddresses(deployerAddress));
    }
}



