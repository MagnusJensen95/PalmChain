pragma solidity ^0.4.24;


contract Plantation {

    //The Consortium contract to which this plantation is related
    Consortium private consortium;

    //Address of owner of this plantation
    address public plantationOwner;

    //Has this plantation been granted permission to operate within
    // its' related consortium?
    bool public approvedByConsortium = false;
    
    //List of indexes in the consortium FFB token pool originating
    // From this plantation
    uint[] tokenIndexes;

    //GPSLongitude of thie plantation
    string GPSLongitude;

    //GPSlatitude of thie plantation
    string GPSlatitude; 

    //Address of RSPO admin assigned to related consortium
    address public RSPOAdministratorConsortium;

    //Boolean value indicating if this plantation
    //contract has requested permission to operate
    //within the related consortium
    bool public pendingApproval = false;

    //Arbitrary name value
    string public Name = "Unset Name";
    
    //Event emitting index of newly submitted token
    event FFBTokenSubmitted(address owner, address newOwner, uint index);

    //Mapping of users granted access to operate on behalf of the plantation
    //besides the plantation owner.
    mapping (address => address) public plantationPermit;

    //Constructor, instantiating the related consortium along with assigning
    //address to the RSPO admin and the plantation owner. 
    constructor(address _consortiumOwnerAddress, address assignedPlantationOwner,
                address rspoAdmin) public {}  

    //Sets name of plantation
    function setPlantationName(string name) public{}

    //Sets Longitude of plantation
    function setPlantationLongitude(string GPSLongitudeParam) public {}

    //Sets Latitude of plantation
    function setPlantationLatitude(string GPSlatitudeParam) public {}

    //returns information related to this plantation
    function getPlantationInformation() public view returns (string, bool, bool, address) {}

    //Request addition of this plantation to consortium origin
    function requestPlantationSubscription() public {}

    //Sets the approval status of this plantation in regards
    //tho the related consortium. Must be invoked by RSPO admin.
    function setPlantationApproved(bool approved, address origin) public {}

    //Submit FFB token to consortium on behalf of this plantation.
    function submitFFBToken(uint weight, uint harvestTimeStamp) public {}

    //Emit the FFBTokenSubmitted event.
    function emitFFBEvent(address millAddress, uint index) public {}

    //Store a new index in the tokenIndexes array
    function saveFFBToken(uint tokenId, address callOrigin) public {}

    //Get id's of tokens submitted from this plantation
    function getTokenIds() public view  returns (uint[] memory idCollection) {}
       

    
}