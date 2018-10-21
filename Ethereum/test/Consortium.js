const Consortium = artifacts.require("Consortium");

contract('Consortium functionality test', async (accounts) => {
    let instance;
    let rspoAdmin;
    beforeEach(async () => {
        instance = await Consortium.deployed();
        rspoAdmin = await instance.RSPOAdministrator.call();
    })

    it("Should assign an RSPO Administrator", async () => {

        assert.equal(rspoAdmin, accounts[0]);
    })

    it("should call a function that depends on a linked library", async () => {

        assert.equal(1, 1);

    });




})