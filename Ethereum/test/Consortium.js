const Consortium = artifacts.require("Consortium");

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


        truffleAssert.eventEmitted(tx, 'Play', (ev) => {
            return ev.player === bettingAccount && !ev.betNumber.eq(ev.winningNumber);
        });

    });




})