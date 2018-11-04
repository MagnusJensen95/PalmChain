pragma solidity ^0.4.0;

import './Consortium.sol';

contract ConsortiumDeployer {
    address[] public deployedConsortiums;

    function createConsortium() public {
        address newConsortium = new Consortium(msg.sender);
        deployedConsortiums.push(newConsortium);
    }

    function getDeployedConsortiums() public view returns (address[]) {
        return deployedConsortiums;
    }
}