
import ConsortiumDeployer from "../contracts/ConsortiumDeployer.json";
import address from '../factoryAddress'
import web3 from './getWeb3';

var consortiumDeployer = new web3.eth.Contract(ConsortiumDeployer.abi, address);

export default consortiumDeployer;