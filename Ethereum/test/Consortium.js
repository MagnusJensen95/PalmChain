const Consortium = artifacts.require("Consortium");

contract('Consortium functionality test', async (accounts) => {

                it("Should assign an RSPO Administrator", async () => {
                    let instance = await Consortium.deployed();
                    let admin = await instance.getBalance.call(accounts[0]);
                    assert.equal(balance.valueOf(), 10000);
                })

                it("should call a function that depends on a linked library", async () => {
                    let meta = await MetaCoin.deployed();
                    let outCoinBalance = await meta.getBalance.call(accounts[0]);
                    let metaCoinBalance = outCoinBalance.toNumber();
                    let outCoinBalanceEth = await meta.getBalanceInEth.call(accounts[0]);
                    let metaCoinEthBalance = outCoinBalanceEth.toNumber();
                    assert.equal(metaCoinEthBalance, 2 * metaCoinBalance);

                });

                it("should send coin correctly", async () => {


                })