pragma solidity ^0.4.24;

contract ConsortiumDeployer {

    //List of addresses of consortium contracts deployed by this contract
    address[] public deployedConsortiums;

    //List of addresses of plantation contracts deployed by this contract
    address[] public deployedPlantations;

    //Mapping indicating whether a user is identified
    //as an RSPO administrator
    mapping (address => bool) public rspoAdministrators;

    //Dynamically adjusted array used to filter plantations
    address[] plantationsToReturn;
   
    //Mapping indicating the related consortium address
    //of a given plantation address.
    mapping (address => address) public plantationRelations;

    //Mapping indicating the plantation address to which
    //the given user address is indicated as the plantation owner
    //only enables ownership of one plantation.
    mapping (address => address) public plantationOwnerRelation;

    //Constructor function.
    constructor() public {
        rspoAdministrators[msg.sender] = true;
    }

    //Creates and deploys a new consortium contract to the blockchain
    function createConsortium() public {
        require(rspoAdministrators[msg.sender], "Only certified RSPO administrators may instantiate new consortiums");
        address newConsortium = new Consortium(msg.sender);
        deployedConsortiums.push(newConsortium);
    }
    
    //Creates and deploys a new plantation contract to the blockchain
       function createPlantation(address _assignedConsortium, address administrator) public {
        address newPlantation = new Plantation(_assignedConsortium, msg.sender, administrator);
        plantationRelations[newPlantation] = _assignedConsortium;
        plantationOwnerRelation[msg.sender] = newPlantation;
        deployedPlantations.push(newPlantation);
    }

    //Get list of deployed consortiums
    function getDeployedConsortiums() public view returns (address[]) {
        return deployedConsortiums;
    }

    //Get list of deployed plantations
     function getDeployedPlantations() public view returns (address[]) {
        return deployedPlantations;
    }

    //Get list of plantation contract address related to a given consortium
    //Contract
     function getDeployedPlantationsByConsortium(address consortiumFilterInstance) public returns (address[]) {
         
          delete plantationsToReturn;
          for (uint i=0; i<deployedPlantations.length; i++) {

              if(plantationRelations[deployedPlantations[i]] == consortiumFilterInstance){
                  plantationsToReturn.push(deployedPlantations[i]);
              }
          }
          return plantationsToReturn;
    }
}