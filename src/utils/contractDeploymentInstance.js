
import ConsortiumDeployer from "../contracts/ConsortiumDeployer.json";
//import address from '../factoryAddress'
import web3 from './getWeb3';

export const consortiumDeployer = (address) => {

    return new web3.eth.Contract(ConsortiumDeployer.abi, address);

}



export const deployNewConsortiumDeployer = async (userAddress) => {

    //Instance of deployer would exist in real world case though
    let instance = new web3.eth.Contract(ConsortiumDeployer.abi);
    let deployment = await instance.deploy({ data: ConsortiumDeployer.bytecode }).send({
        from: userAddress,
        gas: 47123880,
        gasPrice: 100000000000

    });





    return deployment._address;
}


