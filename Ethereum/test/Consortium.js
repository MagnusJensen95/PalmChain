const Consortium = artifacts.require("Consortium");
const ConsortiumDeployer = artifacts.require("ConsortiumDeployer");
const Plantation = artifacts.require("Plantation");
const truffleAssert = require("truffle-assertions");


mapResponseToFFBToken = token => {
  return {
    weight: token[0].toNumber(),
    plantationOrigin: token[1],
    owner: token[2],
    newOwner: token[3],
    harvestTimeStamp: token[4].toNumber(),
    RSPOCertified: token[5],
    processed: token[6]
  };
};

mapResponseToCOToken = token => {
  return {
    weight: token[0].toNumber(),
    plantationOrigin: token[1],
    owner: token[2],
    newOwner: token[3],
    harvestTimeStamp: token[4].toNumber(),
    RSPOCertified: token[5],
    processed: token[6]
  };
};

contract("Consortium functionality test", async accounts => {
  let instance;
  let plantationInstance;
  let consortiumDeployerInstance
  let rspoAdmin = accounts[0];
  let millAddress = accounts[1];
  let plantationAddress = accounts[2];
  let emittedEvent;

  let plantation = {
    name: "Test Plantation",
    capacity: 100,
    longitude: "North",
    latitude: "West"
  };

  let fruitToken = {
    weight: 230,
    plantationOrigin: accounts[2],
    owner: accounts[2],
    newOwner: "0x0",
    harvestTimeStamp: 1540463854654,
    RSPOCertified: true,
    processed: false
  };

  let mill = {
    associatedAddress: millAddress,
    longitude: "North",
    latitude: "West",
    name: "Test Mill"
  };

  const deploy = async () => {
    consortiumDeployerInstance = await ConsortiumDeployer.new({
      from: accounts[0]
    });
    await consortiumDeployerInstance.createConsortium({
      from: accounts[0]
    });

    let newConsortiumAddress = await consortiumDeployerInstance.getDeployedConsortiums({
      from: accounts[0]
    });

    let actualAddress = newConsortiumAddress[0];
    instance = await Consortium.at(actualAddress)
    rspoAdmin = await instance.RSPOAdministrator.call();
    await consortiumDeployerInstance.createPlantation(actualAddress, rspoAdmin, {
      from: accounts[6]
    });

    let newPlantationAddress = await consortiumDeployerInstance.getDeployedPlantations({
      from: accounts[0]
    });
    actualPlantationAddress = newPlantationAddress[0];


    plantationInstance = await Plantation.at(actualPlantationAddress)

  };

  beforeEach(async () => {
    await deploy();
    // instance = await Consortium.deployed();
  });

  it("Should assign an RSPO Administrator", async () => {
    assert.equal(rspoAdmin, accounts[0]);
  });

  it("should allow foreign plantations to request access", async () => {
    let tx = await plantationInstance.requestPlantationSubscription(

      {
        from: accounts[6]
      }
    );
    let exists = await instance.pendingPlantationRequests(actualPlantationAddress)

    assert.equal(exists, true);
  });

  it("should enable RSPO Admin to accept pending request", async () => {
    let tx = await plantationInstance.requestPlantationSubscription(
      {
        from: accounts[6]
      }
    );

    let txApprove = await instance.approvePlantationRequest(actualPlantationAddress, {
      from: rspoAdmin
    });

    //  truffleAssert.eventEmitted(txApprove, "PlantationSubmissionApproved");

    let approved = await plantationInstance.approvedByConsortium();
    assert.equal(approved, true);
  });

  it("should allow RSPO admin to change current Mill instance", async () => {

    let txApprove = await instance.setMill(
      mill.longitude,
      mill.latitude,
      mill.name,
      mill.associatedAddress,
      {
        from: rspoAdmin
      }
    );
    let milli = await instance.activeMill();

    assert.equal(milli[3], mill.name);
  });

  it("should allow an approved plantation to submit FFB Tokens", async () => {
    let tx = await plantationInstance.requestPlantationSubscription(

      {
        from: accounts[6]
      }
    );

    await instance.setMill(
      mill.longitude,
      mill.latitude,
      mill.name,
      mill.associatedAddress,
      {
        from: rspoAdmin
      }
    );


    let txApprove = await instance.approvePlantationRequest(actualPlantationAddress, {
      from: rspoAdmin
    });
    //truffleAssert.eventEmitted(txRequest, "PlantationSubmissionRequested");
    //truffleAssert.eventEmitted(txApprove, "PlantationSubmissionApproved");


    let tokenSubmit = await plantationInstance.submitFFBToken(
      fruitToken.weight,
      fruitToken.harvestTimeStamp,
      {
        from: accounts[6]
      }
    );





    assert.ok(tokenSubmit);
    let index = -1;
    truffleAssert.eventEmitted(tokenSubmit, "FFBTokenSubmitted", fruitEvent => {
      index = fruitEvent.index;
      return true;
    });
    let FFBTokenRes = await instance.FFBTokens(index);
    assert.ok(FFBTokenRes);
  });

  it("Mill must be able to make COToken from FFBTokens", async () => {
    //Set mill
    let txApproveMill = await instance.setMill(
      mill.longitude,
      mill.latitude,
      mill.name,
      mill.associatedAddress,
      {
        from: rspoAdmin
      }
    );
    let milli = await instance.activeMill();

    assert.equal(milli[3], mill.name);

    //Plantation subscription flow
    let tx = await plantationInstance.requestPlantationSubscription(
      {
        from: accounts[6]
      }
    );
    let txApprove = await instance.approvePlantationRequest(actualPlantationAddress, {
      from: rspoAdmin
    });
    //truffleAssert.eventEmitted(txRequest, "PlantationSubmissionRequested");
    //truffleAssert.eventEmitted(txApprove, "PlantationSubmissionApproved");



    /*-------------------------------------------------------------------------- */


    let indexArray = [];
    let fruitWeight = 0;
    for (let i = 0; i < 5; i++) {
      fruitWeight += fruitToken.weight + i;

      let tokenSubmit = await plantationInstance.submitFFBToken(
        fruitToken.weight + i,
        fruitToken.harvestTimeStamp,
        {
          from: accounts[6]
        }
      );


      truffleAssert.eventEmitted(
        tokenSubmit,
        "FFBTokenSubmitted",
        fruitEvent => {
          indexArray.push(fruitEvent.index);
          return true;
        }
      );
    }
    let result = await instance.getUnprocessedTokenIndexes({
      from: millAddress
    })
    let result1 = await instance.FFBTokens(0, {
      from: millAddress
    })


    let COTokenRes = await instance.consumeFFBTokens(indexArray, {
      from: millAddress
    });

    let oilIndex = 0;
    truffleAssert.eventEmitted(COTokenRes, "COTokenSubmitted", coTokenIndex => {
      oilIndex = coTokenIndex.index;
      return true;
    });
    let isProcessedFFB = await instance.FFBTokens(0);


    let newOilToken = await instance.COTokens(oilIndex);
    let tokenWeight = newOilToken[0].toNumber();
    assert.equal(tokenWeight, fruitWeight);

    assert.ok(COTokenRes);

    // Also assert that included tokens have been processed and their owner / newOwner has changed

    for (let batchIndex of indexArray) {
      let FFBTokenToCheck = await instance.FFBTokens(batchIndex);
      let resolvedToken = mapResponseToFFBToken(FFBTokenToCheck);
      assert.equal(resolvedToken.processed, true);
      assert.equal(resolvedToken.owner, millAddress);
    }
  });

  it("Should instantiate plantation with correct plantation owner", async () => {

    let ownerAddress = await plantationInstance.plantationOwner();

    assert.equal(accounts[6], ownerAddress)
  });
});
