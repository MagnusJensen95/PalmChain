pragma solidity ^0.4.24;

contract Consortium {
    
    //Struct representing the mill data structure
    struct Mill {}
    
    //Events:

    //Event emitting the index of a newly submitted FFBToken
    event FFBTokenSubmitted(address owner, address newOwner, uint index);

    //Event emitting the index of a newly submitted COToken (Crude Oil Token)
    event COTokenSubmitted(address owner, address newOwner, uint index);

    //Event emitting the address of a plantation having requested permission
    //to operate within the consortium
    event PlantationSubmissionRequested(address plantationAddressOrigin);

    //Event emitting the address of a newly approved plantation contract
    event PlantationSubmissionApproved(address plantationAddressOrigin);

    //Storage variables

    //Active mill instance operating within this consortium
    Mill public activeMill;

    //Array of approved plantation contract addresses
    address[] public plantationAddresses;
    
    //Mapping used to check approval status of plantation
    mapping (address => bool) public registeredPlantations;

     //Mapping used to check whether a plantation address is pending approval
    mapping (address => bool) public pendingPlantationRequests;

    //A list of pending plantation approvals
    address[] public pendingPlantationRequestsArray;

    //List of FFB tokens figuring within the consortium
    TokenDefinitions.FFBToken[] public FFBTokens;

    //List of CO tokens figuring within the consortium
    TokenDefinitions.COToken[] public COTokens;  

    //Address of current RSPO administrator on the blockchain. Set upon initialization.
    address public RSPOAdministrator;

    //Array dynamically listing tokens to include in creation of new COToken
    uint[] public tokensToInclude;

    //Modifiers

    //Only grants RSPO admin permission to invoke function
    modifier onlyRSPOAdmin {}

    //Functions
    
    //Contract constructer, setting the address of internal RSPO Administrator
    constructor(address RSPOAdmin) public {}
    
    //Lets the RSPO administrator approve a plantation request, granting the plantation 
    //permission to submit FFB tokens to this contract
    function approvePlantationRequest(address plantationToAdd) public onlyRSPOAdmin {}
    
    //Initializes Mill struct. Has to be done in order to submit FFB tokens.
    function setMill(string GPSLongitude,string GPSLatitude,
                     string name, address origin) public onlyRSPOAdmin {}
    
    //Lets an approved plantation submit a new FFB token.
    function submitFFBToken(
        uint weight, uint harvestTimeStamp, address plantationOwner) public {}
    
    //Lets the mill representative create CO Tokens from unprocessed FFB tokens
    function consumeFFBTokens(uint[] tokenIndexes) public {}

    //Revokes the access of a plantation contract, that it may no longer send
    //FFB Tokens, until it has been approved once more. 
    function revokePlantationAccess(address plantation) onlyRSPOAdmin public {}

    //Returns struct paramaters corresponding to FFBToken struct at
    // a given index in the FFBTokens array.
    function getFFBTokenAtIndex(uint index) public view returns(      
        uint, address, address, address, uint, bool, bool, uint){}

    //Gets a list of FFB tokens that have not yet been processed
    //into CO Tokens
    function getUnprocessedTokenIndexes() public view returns (uint[]){}
}



