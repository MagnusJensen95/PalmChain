pragma solidity ^0.4.24;

contract Plantation {

    Consortium private consortium;

    address public plantationOwner;

    bool public approvedByConsortium = false;
 
    TokenDefinitions.FFBToken[] public FFBTokens;

    uint[] tokenIndexes;

    uint capacity;

    string GPSLongitude;

    string GPSlatitude; 

    address public RSPOAdministratorConsortium;

    bool public pendingApproval = false;

    string public Name = "Unset Name";

    event FFBTokenSubmitted(address owner, address newOwner, uint index);

    mapping (address => address) public plantationPermit;

    constructor(address _consortiumOwnerAddress,
                address assignedPlantationOwner, address rspoAdmin) public {}  

    function setPlantationName(string name) public{}

    
    function setPlantationLongitude(string GPSLongitudeParam) public {}

    
    function setPlantationLatitude(string GPSlatitudeParam) public {}

     function getPlantationInformation() public view
      returns (string, bool, bool, address) {}


    //Request addition of this plantation to consortium origin
    function requestPlantationSubscription() public {}

    function setPlantationApproved(bool approved, address origin) public {}
    
    function submitFFBToken(
        uint weight,
        uint harvestTimeStamp
        ) public {}

    function emitFFBEvent(address millAddress, uint index) public {}

    function saveFFBToken(
        uint tokenId,
        address callOrigin
      ) public {}

    function getTokenAmount() public view returns (uint) {}

    function getTokenIds() public view  returns (uint[] memory idCollection) {}
}