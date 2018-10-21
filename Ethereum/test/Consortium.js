const Consortium = artifacts.require("Consortium");
const truffleAssert = require('truffle-assertions');

contract('Consortium functionality test', async (accounts) => {
    let instance;
    let rspoAdmin;
    let millAddress = accounts[1];
    let plantationAddress = accounts[2];
    beforeEach(async () => {
        instance = await Consortium.deployed();
        rspoAdmin = await instance.RSPOAdministrator.call();
    })

    it("Should assign an RSPO Administrator", async () => {

        assert.equal(rspoAdmin, accounts[0]);
    })

    it("should allow foreign plantations to request access", async () => {
        let name = "Test Plantation";
        let capacity = 100;
        let longitude = "North";
        let latitude = "West";
        let tx = await instance.requestPlantationSubscription(name, capacity, longitude, latitude, {
            from: plantationAddress
        });
        truffleAssert.eventEmitted(tx, 'PlantationSubmissionRequested');

    });




})