pragma solidity ^0.4.0;
import './Plantation.sol';


library TokenDefinitions {
        struct FFBToken {

        uint weight;
        address plantationOrigin;
        address owner;
        address newOwner;
        uint harvestTimeStamp;
        bool RSPOCertified;
        bool processed;
        uint tokenId;
    

    } 

       struct COToken {

        uint weight;
        uint[] containedFFB;
        address millOrigin;
        address owner;
        address newOwner;
        bool RSPOCertified;
        bool processed;
        uint tokenId;
    }
}

contract Consortium {
    
 

    struct Mill {
        address associatedAddress;
        string GPSLongitude;
        string GPSLatitude;     
        string name;

    }
    

    //Events:
    event FFBTokenSubmitted(address owner, address newOwner, uint index);
    event COTokenSubmitted(address owner, address newOwner, uint index);
    event PlantationSubmissionRequested(address plantationAddressOrigin);
    event PlantationSubmissionApproved(address plantationAddressOrigin);

   // event PlantationSubmissionRequested(address owner, address newOwner, uint index);
    
    Mill public activeMill;

   mapping (address => bool) public plantations;

   address[] public plantationAddresses;
    
    mapping (address => bool) public registeredPlantations;

//    Mapping below has been left out. May be relevant in future implementations. 
//    mapping (address => bool) public certifiedPlantations;


     mapping (address => bool) public pendingPlantationRequests;
     address[] public pendingPlantationRequestsArray;


    TokenDefinitions.FFBToken[] public FFBTokens;


   
     TokenDefinitions.COToken[] public COTokens;
    
    address public RSPOAdministrator;
    
    mapping (bytes32 => bool) public COExists;
    
    mapping (bytes32 => bool) public FFBExists;

    uint[] public tokensToInclude;
    
    modifier onlyRSPOAdmin {
        require(msg.sender == RSPOAdministrator, "RSPO authentication required");
         _;
    }
    
    constructor(address RSPOAdmin) public {
        RSPOAdministrator = RSPOAdmin;
    }

    //Request addition of new Plantation to consortium
    function requestPlantationSubscription() public {
      
                //msg.sender is assumed to be address of plantation
        require(!registeredPlantations[msg.sender], "Plantation is already registered");

        
        emit PlantationSubmissionRequested(msg.sender);
        
        pendingPlantationRequests[msg.sender] = true;
        
        
    }
    
    function approvePlantationRequest(address plantationToAdd) public onlyRSPOAdmin {
        
        //Index may be derived from planatation hash rather than passed with index

        plantations[plantationToAdd] = true;
        plantationAddresses.push(plantationToAdd);
        
        registeredPlantations[plantationToAdd] = true;
        delete pendingPlantationRequests[plantationToAdd];
        emit PlantationSubmissionApproved(plantationToAdd);

        Plantation p = Plantation(plantationToAdd);
        p.setPlantationApproved(true, msg.sender);
        
    }
    
    function setMill(string GPSLongitude,
        string GPSLatitude,
        
        string name,
        address origin) public onlyRSPOAdmin {
            
            Mill memory newMill = Mill({
            name: name,
            associatedAddress: origin,
            GPSLatitude:GPSLatitude,
            GPSLongitude:GPSLongitude
        });
        
        activeMill = newMill;
        
    }
    
    
    function submitFFBToken(
        uint weight,
        uint harvestTimeStamp,
        address plantationOwner
        ) public {

        //Find date løsning
        //Assume call comes from plantation contract => msg.sender is valid
        require(registeredPlantations[msg.sender], "Access Denied, no permission detected");
        require(activeMill.associatedAddress != address(0x0000000000000000000000000000000000000000), "No Mill instance has been configured yet");
        
        // Below may be changed if non certified plantations should be granted access.
        bool isCertified = true; 
        uint tokenIndex = FFBTokens.length;


        TokenDefinitions.FFBToken memory token = TokenDefinitions.FFBToken({
         weight: weight,
         plantationOrigin: msg.sender,
         owner: msg.sender,
         newOwner: activeMill.associatedAddress,
         harvestTimeStamp: harvestTimeStamp,
         RSPOCertified: isCertified,
         processed: false,
         tokenId: tokenIndex});

        FFBTokens.push(token);

             Plantation p = Plantation(msg.sender);
             p.emitFFBEvent( activeMill.associatedAddress, FFBTokens.length -1);
             p.saveFFBToken(
                 token.weight,
                 token.plantationOrigin,
                 token.owner,
                 token.newOwner,
                 token.harvestTimeStamp,
                 token.RSPOCertified,
                 token.processed,
                 token.tokenId,
                 plantationOwner);
        
       
        }

    
    function consumeFFBTokens(uint[] tokenIndexes) public {
        require(tokenIndexes.length > 0, "You must include tokens");

        //Calculate token weight from FFB tokens
        require(msg.sender == activeMill.associatedAddress, "Only active mill owner is allowed to create COTokens");
        bool allTokensCertified = true;
        uint coWeight = 0;
        for (uint i=0; i<tokenIndexes.length; i++) {


               require(FFBTokens[tokenIndexes[i]].newOwner == msg.sender, "This is not the intended destination of the token");
               require(!FFBTokens[tokenIndexes[i]].processed, "This token has already been processed");
                     
                tokensToInclude.push(tokenIndexes[i]);
                coWeight += FFBTokens[tokenIndexes[i]].weight;
                if(!FFBTokens[tokenIndexes[i]].RSPOCertified){
                 
                    allTokensCertified = false;
                }              
                
        }

        if(tokensToInclude.length > 0){
            uint tokenIndex = COTokens.length;
           
            TokenDefinitions.COToken memory token =  TokenDefinitions.COToken({
             weight: coWeight,
             containedFFB: tokensToInclude,
             owner: msg.sender,
             newOwner:  0,
             millOrigin: activeMill.associatedAddress,
             RSPOCertified: allTokensCertified,
             processed: false,
             tokenId: tokenIndex
    
            });

            COTokens.push(token);
           emit COTokenSubmitted(token.owner, token.newOwner, COTokens.length-1);
                 for (uint j=0; j<tokensToInclude.length; j++) {
                 TokenDefinitions.FFBToken storage tokenToUpdate =  FFBTokens[tokensToInclude[j]];
                  tokenToUpdate.processed = true;
                  tokenToUpdate.newOwner = 0;
                  tokenToUpdate.owner = msg.sender;
           
                 }
            delete tokensToInclude;

        }
    }

    function revokePlantationAccess(address plantation) onlyRSPOAdmin public {
        delete registeredPlantations[plantation];
          Plantation p = Plantation(plantation);
                 p.setPlantationApproved(false, msg.sender);
    }

    function getPlantationAtAddress(address plantation) onlyRSPOAdmin public view returns(address){
        return plantation;
        
    }

    function getFFBTokenAtIndex(uint index) public view returns(      
        uint,
        address,
        address,
        address,
        uint,
        bool,
        bool,
        uint){
        TokenDefinitions.FFBToken memory token = FFBTokens[index];

        return(token.weight, token.plantationOrigin, token.owner, 
       token.newOwner, token.harvestTimeStamp,
       token.RSPOCertified, token.processed, token.tokenId);

           
        }


    function getUnprocessedTokenIndexes() public view returns (uint[] ){

        uint size = FFBTokens.length;
        uint counter = 0;

        uint[] memory indexes = new uint[](size);
                 for (uint i=0; i<size; i++) {
                     if(!FFBTokens[i].processed){
                         indexes[counter] = i;
                         counter++;

                     }
           }
           uint[] memory fittedArray = new uint[](counter);
             for (uint j=0; j<size; j++) {
                    
                         fittedArray[j] = indexes[j];                                
           }
           return fittedArray;
    }

        function getCoTokenAmount() public view returns (uint) {

        return COTokens.length;
    }

    

 
 
}