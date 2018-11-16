import React, { Component } from "react";

import { connect } from "react-redux";
import web3 from "../../utils/getWeb3";
import {
  fetchConsortiumAddresses,
  setSelectedConsortiumAddress,
  deployNewConsortiumDeployerAction,
  deployConsortium,
  deployPlantation
} from "../../store/actions/consortiumlist";
import {
  ListItem,
  List,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  Button
} from "@material-ui/core";
import TopBar from "../../components/TopBar/TopBar";
import './overview.css'
import { rspoAdmin } from "../../store/models/authentication";


class Overview extends Component {
  componentDidMount() {
    //let address = web3.eth.getAccounts()[0];
    if (this.props.consortiumDeployerAddress === "") {
      return;
    }
    this.props.onFetchConsortiumList(this.props.consortiumDeployerAddress);
  }

  deployPlantation() {
 

    if (this.props.consortiumAddress === "" || this.props.userAuthenticationType !== rspoAdmin) {
      return;
    }
  

    this.props.onAddPlantation(this.props.consortiumDeployerAddress, this.props.consortiumAddress, this.props.signedInUserAddress);

  }

  render() {
    const deploymentButton = this.props.consortiumDeployerAddress === "" ?
      <div className="centerButton">
        <Button variant="contained" color="primary" onClick={() => this.props.onInstantiateDeployer()}>Instantiate Consortium Deployer</Button>
      </div>
      :

      <div>
        <List>
          {this.props.consortiumList.map((element, index) => (
            <ListItem
              button
              onClick={() => this.props.onSetConsortiumAddress(element)}
            >
              <ListItemText primary={element} />
              <ListItemSecondaryAction>
                <Checkbox checked={element === this.props.consortiumAddress} />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <div className="addInstanceContainer">
          <Button variant="outlined" color="primary" onClick={() => this.props.onAddConsortium(this.props.consortiumDeployerAddress)}>Add Consortium</Button>
          <Button variant="outlined" color="primary" onClick={() => this.deployPlantation()}>Add Plantation</Button>
        </div></div>;

    return (
      <div>
        <TopBar title={"Consortium instance overview"} />
        {deploymentButton}

      </div>
    );
  }
}

const mapStateToProps = state => ({
  consortiumList: state.consortiumListReducer.consortiumList,
  consortiumAddress: state.consortiumListReducer.selectedAddress,
  consortiumDeployerAddress: state.consortiumListReducer.consortiumDeployerAddress,
  userAuthenticationType: state.authenticationReducer.authType,
  signedInUserAddress: state.authenticationReducer.userAddress
});

const mapDispatchToProps = dispatch => ({
  onSetConsortiumAddress: consortiumAddress =>
    dispatch(setSelectedConsortiumAddress(consortiumAddress)),
  onFetchConsortiumList: userAddress =>
    dispatch(fetchConsortiumAddresses(userAddress)),
  onInstantiateDeployer: () => dispatch(deployNewConsortiumDeployerAction()),
  onAddConsortium: (deployerAddress) => dispatch(deployConsortium(deployerAddress)),
  onAddPlantation: (deployerAddress, consortiumAddress, userAddress) => dispatch(deployPlantation(deployerAddress, consortiumAddress, userAddress)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
