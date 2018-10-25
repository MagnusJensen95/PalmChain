const Consortium = artifacts.require("Consortium");
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
    instance = await Consortium.new({
      from: accounts[0]
    });
    rspoAdmin = await instance.RSPOAdministrator.call();
  };

  beforeEach(async () => {
    await deploy();
    // instance = await Consortium.deployed();
  });

  it("Should assign an RSPO Administrator", async () => {
    assert.equal(rspoAdmin, accounts[0]);
  });

  it("should allow foreign plantations to request access", async () => {
    let tx = await instance.requestPlantationSubscription(
      plantation.name,
      plantation.capacity,
      plantation.longitude,
      plantation.latitude,
      {
        from: plantationAddress
      }
    );
    truffleAssert.eventEmitted(tx, "PlantationSubmissionRequested", ev => {
      emittedEvent = ev;
      return true;
    });

    assert.equal(emittedEvent.plantationAddressOrigin, plantationAddress);
  });

  it("should enable RSPO Admin to accept pending request", async () => {
    let tx = await instance.requestPlantationSubscription(
      plantation.name,
      plantation.capacity,
      plantation.longitude,
      plantation.latitude,
      {
        from: plantationAddress
      }
    );

    let txApprove = await instance.approvePlantationRequest(plantationAddress, {
      from: rspoAdmin
    });

    truffleAssert.eventEmitted(txApprove, "PlantationSubmissionApproved");

    let name = await instance.getPlantationAtAddress(plantationAddress);
    assert.equal(name, plantation.name);
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
    let txRequest = await instance.requestPlantationSubscription(
      plantation.name,
      plantation.capacity,
      plantation.longitude,
      plantation.latitude,
      {
        from: plantationAddress
      }
    );
    let txApprove = await instance.approvePlantationRequest(plantationAddress, {
      from: rspoAdmin
    });
    truffleAssert.eventEmitted(txRequest, "PlantationSubmissionRequested");
    truffleAssert.eventEmitted(txApprove, "PlantationSubmissionApproved");

    let tokenSubmit = await instance.submitFFBToken(
      fruitToken.weight,
      fruitToken.harvestTimeStamp,
      {
        from: plantationAddress
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
    let txRequest = await instance.requestPlantationSubscription(
      plantation.name,
      plantation.capacity,
      plantation.longitude,
      plantation.latitude,
      {
        from: plantationAddress
      }
    );
    let txApprove = await instance.approvePlantationRequest(plantationAddress, {
      from: rspoAdmin
    });
    truffleAssert.eventEmitted(txRequest, "PlantationSubmissionRequested");
    truffleAssert.eventEmitted(txApprove, "PlantationSubmissionApproved");

    /*-------------------------------------------------------------------------- */

    let indexArray = [];
    let fruitWeight = 0;
    for (let i = 0; i < 5; i++) {
      fruitWeight += fruitToken.weight + i;
      let tokenSubmit = await instance.submitFFBToken(
        fruitToken.weight + i,
        fruitToken.harvestTimeStamp,
        {
          from: plantationAddress
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

    let COTokenRes = await instance.consumeFFBTokens(indexArray, {
      from: millAddress
    });
    let oilIndex = 0;
    truffleAssert.eventEmitted(COTokenRes, "COTokenSubmitted", coTokenIndex => {
      oilIndex = coTokenIndex.index;
      return true;
    });

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
});
