pragma solidity ^0.4.24;


import './Consortium.sol';


import { TokenDefinitions } from "./Consortium.sol";


contract Plantation {



    Consortium private consortium;
    address public plantationOwner;
    bool public approvedByConsortium = false;
   // bool public certifiedByConsortium = false;


    
    TokenDefinitions.FFBToken[] public FFBTokens;
    uint capacity;
    string GPSLongitude;
    string GPSlatitude; 
    address public RSPOAdministratorConsortium;
    bool public pendingApproval = false;
    string public Name = "Unset Name";
    


    event FFBTokenSubmitted(address owner, address newOwner, uint index);
    mapping (address => address) public plantationPermit;


    constructor(address _consortiumOwnerAddress, address assignedPlantationOwner, address rspoAdmin) public {
    plantationOwner = assignedPlantationOwner;
    RSPOAdministratorConsortium = rspoAdmin;
    consortium = Consortium(_consortiumOwnerAddress);
    }  

    function setPlantationName(string name) public{
        require(msg.sender == RSPOAdministratorConsortium, "Only administrator may change the value of this property");
        Name = name;
    }

    
    function setPlantationLongitude(string GPSLongitudeParam) public {
        require(msg.sender == RSPOAdministratorConsortium, "Only administrator may change the value of this property");
        GPSLongitude = GPSLongitudeParam;
    }

    
    function setPlantationLatitude(string GPSlatitudeParam) public {
        require(msg.sender == RSPOAdministratorConsortium, "Only administrator may change the value of this property");
        GPSlatitude = GPSlatitudeParam;
    }

     function getPlantationInformation() public view returns (string, bool, bool, address) {
        return (Name, approvedByConsortium, pendingApproval, plantationOwner);
    }


    //Request addition of this plantation to consortium origin
    function requestPlantationSubscription() public {
      
    require(!approvedByConsortium, "This plantation has already been approved");
    require(msg.sender == plantationOwner, "Only owner may seek permission to enter consortium");
        consortium.requestPlantationSubscription();
        pendingApproval = true;
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
            consortium.submitFFBToken(weight, harvestTimeStamp, msg.sender);

       
        }


    function emitFFBEvent(address millAddress, uint index) public {
        emit FFBTokenSubmitted(this, millAddress, index);
      
    }

    function saveFFBToken(
        uint weight,
        address plantationOrigin,
        address owner,
        address newOwner,
        uint harvestTimeStamp,
        bool RSPOCertified,
        bool processed,
        uint tokenId,
        address callOrigin) public {

        require(callOrigin == plantationOwner, "this function is only callable as a result of an added token in the parent contract");

        TokenDefinitions.FFBToken memory token = TokenDefinitions.FFBToken({
         weight: weight,
         plantationOrigin: plantationOrigin,
         owner: owner,
         newOwner: newOwner,
         harvestTimeStamp: harvestTimeStamp,
         RSPOCertified: RSPOCertified,
         processed: processed,
         tokenId: tokenId});
    
        FFBTokens.push(token);


    }

    function getTokenAmount() public view returns (uint) {

        return FFBTokens.length;
    }

    //  function getTokenIds() public view  returns (uint[] memory idCollection) {
    //       uint length = FFBTokens.length;
     

    //      for (uint i=0; i<FFBTokens.length; i++) {

    //          idCollection[i] = FFBTokens[i].tokenId;
    //       }
    //     return idCollection;
    // }
       

    
}