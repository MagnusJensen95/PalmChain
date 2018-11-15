pragma solidity ^0.4.0;

import './Consortium.sol';

contract Plantation {

    Consortium private consortium;
    address public plantationOwner;
    bool public approvedByConsortium;
    bool public certifiedByConsortium;
    string name;
    uint capacity;
    string GPSLongitude;
    string GPSlatitude; 
    address public RSPOAdministratorConsortium;

    event FFBTokenSubmitted(address owner, address newOwner, uint index);
    mapping (address => address) public plantationPermit;


    constructor(address _consortiumOwnerAddress, address origin, address rspoAdmin) public {
    plantationOwner = origin;
    RSPOAdministratorConsortium =rspoAdmin;
    consortium = Consortium(_consortiumOwnerAddress);
    }  


    //Request addition of this plantation to consortium origin
    function requestPlantationSubscription() public {
      
    require(!approvedByConsortium, "This plantation has already been approved");
    require(msg.sender == plantationOwner, "Only owner may seek permission to enter consortium");
        consortium.requestPlantationSubscription();
    }

    function setPlantationApproved(bool approved, address origin) public {

        require(origin == RSPOAdministratorConsortium, "only the assigned consortium administrator can approve a plantation");

        approvedByConsortium = approved;
       
    }


        
    function submitFFBToken(
        uint weight,
        uint harvestTimeStamp
        
        ) public {

        //Find date løsning
        //Assume call comes from plantation contract => msg.sender is valid
        require(approvedByConsortium, "Access Denied, no permission detected");
            consortium.submitFFBToken(weight, harvestTimeStamp);

       
        }


    function emitFFBEvent(address millAddress, uint index) public {
        emit FFBTokenSubmitted(this, millAddress, index);
      
    }
       

    
}