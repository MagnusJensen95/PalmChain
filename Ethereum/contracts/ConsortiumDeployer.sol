pragma solidity ^0.4.0;

import './Consortium.sol';
import './Plantation.sol';

contract ConsortiumDeployer {
    address[] public deployedConsortiums;
    address[] public deployedPlantations;
    mapping (address => bool) rspoAdministrators;

    constructor() public {
        rspoAdministrators[msg.sender] = true;
    }

    function createConsortium() public {
        require(rspoAdministrators[msg.sender], "Only certified RSPO administrators may instantiate new consortiums");
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