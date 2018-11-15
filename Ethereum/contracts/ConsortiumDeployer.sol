pragma solidity ^0.4.0;

import './Consortium.sol';
import './Plantation.sol';

contract ConsortiumDeployer {
    address[] public deployedConsortiums;
    address[] public deployedPlantations;

    function createConsortium() public {
        address newConsortium = new Consortium(msg.sender);
        deployedConsortiums.push(newConsortium);
    }
       function createPlantation(address _assignedConsortium, address administrator) public {
        address newPlantation = new Plantation(_assignedConsortium, msg.sender, administrator);
        deployedPlantations.push(newPlantation);
    }


    function getDeployedConsortiums() public view returns (address[]) {
        return deployedConsortiums;
    }

     function getDeployedPlantations() public view returns (address[]) {
        return deployedPlantations;
    }
}