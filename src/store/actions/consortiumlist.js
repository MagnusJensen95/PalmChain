import {
    SET_AVAILABLE_CONSORTIUMS,
    SET_CURRENT_CONSORTIUM_ADDRESS,
    SET_CURRENT_CONSORTIUMDEPLOYER_ADDRESS,
    SET_AVAILABLE_PLANTATIONS,
    SET_PLANTATION_INFORMATION_LIST

} from "./types";

import { consortiumDeployer, deployNewConsortiumDeployer } from '../../utils/contractDeploymentInstance';
import web3 from '../../utils/getWeb3';
import consortiumInstance from "../../utils/consortiumInstance";
import { plantationInstance } from "../../utils/plantationInstance";
import { mapToPlantation } from "../../utils/mappings";






export const setAvaibleConsortiumList = list => {
    return {
        type: SET_AVAILABLE_CONSORTIUMS,
        consortiumList: list
    };
};

export const setSelectedConsortiumAddress = address => {
    return {
        type: SET_CURRENT_CONSORTIUM_ADDRESS,
        selectedConsortiumAddress: address
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

export const setPlantationInformationList = list => {
    return {
        type: SET_PLANTATION_INFORMATION_LIST,
        plantationObjects: list
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

export const fetchPlantationAddresses = (deployerAddress, consortiumAddress, userAddress) => {
    return async dispatch => {

        let deployer = consortiumDeployer(deployerAddress);
        if (deployer === undefined) {
            return;
        }
        let plantationAddresses = await deployer.methods.getDeployedPlantationsByConsortium(consortiumAddress).call({
            from: userAddress
        })

        let informationArray = [];
        for (let address of plantationAddresses) {


            let plantationContract = plantationInstance(address);
            let information = await plantationContract.methods.getPlantationInformation().call({
                from: userAddress
            });
            information["address"] = address;


            information = mapToPlantation(information);
            informationArray.push(information);

        }

        dispatch(setPlantationInformationList(informationArray));

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


        dispatch(fetchPlantationAddresses(deployerAddress, consortiumAddress, rspoAddress));
    }
}



