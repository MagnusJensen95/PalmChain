pragma solidity ^0.4.0;
contract Consortium {
    
    struct FFBToken {
        //farmerAddress: address;
        uint weight;
        address plantationOrigin;
        address newOwner;
        string harvestTimeStamp;
        bool RSPOCertified;
        bool processed;
        bytes32 FFBHash;
        bytes32 COToken;

    }
    
    struct COToken {

        uint weight;
        bytes32[] containedFFB;
        address millOrigin;
        address newOwner;
        bool RSPOCertified;
        bool processed;
        bytes32 COHash;
    }
    
    struct Plantation {
        address associatedAddress;
        string name;
        uint capacity;
        string GPSLongitude;
        string GPSLatitude;
        bytes32 RSPOToken;

        //Hash may be omitted in favor of address use
     //   bytes32 plantationHash;
        // Tokens? 
        
    }
    
    struct Mill {
        address associatedAddress;
        string GPSLongitude;
        string GPSLatitude;
        string RSPOToken;
        string name;

        //Hash may be omitted in favor of address use
     //   bytes32 millHash;
    }
    
    
    Mill public activeMill;

    mapping (address => Plantation) public plantations;
    
    mapping (address => bool) public registeredPlantations;
    mapping (address => bool) public certifiedPlantations;

    mapping (address => address) public plantationPermit;

    mapping (address => Plantation) public pendingPlantationRequests;
    
    mapping (bytes32 => FFBToken) public FFBTokens;
    mapping (bytes32 => COToken) public COTokens;
   
    
    address public RSPOAdministrator;
    
    mapping (bytes32 => bool) public COExists;
    
    mapping (bytes32 => bool) public FFBExists;

    bytes32[] public tokensToInclude;
    
    modifier onlyRSPOAdmin {
        require(msg.sender == RSPOAdministrator, "RSPO authentication required");
         _;
    }
    
    constructor() public {
        RSPOAdministrator = msg.sender;
    }
    
    
    //Request addition of new Plantation to consortium
    function requestPlantationSubscription(string name,
        uint capacity,
        string GPSLongitude,
        string GPSLatitude,
        bytes32 RSPOToken
      ) public {
      
        
        Plantation memory newPlantation = Plantation({
            associatedAddress: msg.sender,
            name: name,
            capacity: capacity,
            GPSLatitude:GPSLatitude,
            GPSLongitude:GPSLongitude,
            RSPOToken: RSPOToken
          
        });
        
        //msg.sender is assumed to be address of plantation
          require(!registeredPlantations[msg.sender], "Plantation is already registered");
        
        pendingPlantationRequests[msg.sender] = newPlantation;
        
    }
    
    function approvePlantationRequest(address requestOrigin) public onlyRSPOAdmin {
        
        //Index may be derived from planatation hash rather than passed with index
        plantations[requestOrigin] = pendingPlantationRequests[requestOrigin];
        certifiedPlantations[requestOrigin] = true;
        delete pendingPlantationRequests[requestOrigin];
        
    }
    
    function setMill( string GPSLongitude,
        string GPSLatitude,
        string RSPOToken,
        string name,
        address origin) public onlyRSPOAdmin {
            
            Mill memory newMill = Mill({
            name: name,
            associatedAddress: origin,
            GPSLatitude:GPSLatitude,
            GPSLongitude:GPSLongitude,
            RSPOToken: RSPOToken
        });
        
        activeMill = newMill;
        
    }
    
    
    function submitFFBToken(
        uint weight,
        address plantationOrigin,
        string harvestTimeStamp
        ) public{
            
        require(plantationPermit[msg.sender] == plantationOrigin, "Access Denied, no permission detected");
        bool isCertified = certifiedPlantations[plantationOrigin] = true;  

        bytes32 ffbHash = keccak256(abi.encodePacked(blockhash(block.number), weight, plantationOrigin));

         require(!FFBExists[ffbHash], "Token already submitted");

        FFBToken memory token = FFBToken({
         weight: weight,
         plantationOrigin: plantationOrigin,
         newOwner: activeMill.associatedAddress,
         harvestTimeStamp: harvestTimeStamp,
         RSPOCertified: isCertified,
         processed: false,
         FFBHash: ffbHash,
         COToken: ""});

        FFBTokens[ffbHash] = token;
        FFBExists[token.FFBHash] = true;
        }

    
    function consumeFFBTokens( bytes32[] tokenHashes, uint weight) public {

        require(msg.sender == activeMill.associatedAddress, "Only active mill owner is allowed to create COTokens");
     bool allTokensCertified = true;
        for (uint i=0; i<tokenHashes.length; i++) {

            if(FFBExists[tokenHashes[i]]){
                if(!FFBTokens[tokenHashes[i]].processed){
                    tokensToInclude.push(tokenHashes[i]);
                     if(!FFBTokens[tokenHashes[i]].RSPOCertified){
                 
                          allTokensCertified = false;
                       }
                }
            }
        }

        if(tokensToInclude.length > 0){
            bytes32 coHash = keccak256(abi.encodePacked(blockhash(block.number), weight, tokensToInclude));
           COToken memory token = COToken({
             weight: weight,
             containedFFB: tokensToInclude,
             newOwner: activeMill.associatedAddress,
             millOrigin: activeMill.associatedAddress,
             RSPOCertified: allTokensCertified,
             processed: false,
             COHash: coHash
            });

            COTokens[coHash] = token;
            COExists[coHash] = true;
              for (uint j=0; i<tokensToInclude.length; i++) {
                  FFBTokens[tokensToInclude[j]].processed = true;
                  FFBTokens[tokensToInclude[j]].COToken = coHash;
           
                 }
            delete tokensToInclude;

        }



    }
    
}