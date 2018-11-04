var Migrations = artifacts.require("./Migrations.sol");
var Consortium = artifacts.require("./Consortium.sol");
var ConsortiumDeployer = artifacts.require("./ConsortiumDeployer.sol");



module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(ConsortiumDeployer).then(function () {
    return deployer.deploy(Consortium, ConsortiumDeployer.address);
  });;


};