pragma solidity ^0.4.0;

import './Consortium.sol';
import './Plantation.sol';

contract ConsortiumDeployer {
    address[] public deployedConsortiums;
    address[] public deployedPlantations;
    mapping (address => bool) public rspoAdministrators;
    address[] plantationsToReturn;
   
// plantationAddress => consortiumaddress
    mapping (address => address) public plantationRelations;

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
        plantationRelations[newPlantation] = _assignedConsortium;
        deployedPlantations.push(newPlantation);
    }


    function getDeployedConsortiums() public view returns (address[]) {
        return deployedConsortiums;
    }

     function getDeployedPlantations() public view returns (address[]) {
        return deployedPlantations;
    }

    
     function getDeployedPlantationsByConsortium(address consortiumFilterInstance) public returns (address[]) {
         
            delete plantationsToReturn;
         //MAY NEED TO USE THIS FOR FILTER OPTION, INSTEAD DONE CLIENTSIDE
      

          for (uint i=0; i<deployedPlantations.length; i++) {

              if(plantationRelations[deployedPlantations[i]] == consortiumFilterInstance){
                  plantationsToReturn.push(deployedPlantations[i]);
              }
          }

        return plantationsToReturn;
    }
}