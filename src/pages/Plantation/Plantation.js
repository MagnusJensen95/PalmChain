import React, { Component } from "react";

import { connect } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";
import {
  submitFFBToken,
  fetchPlantationInformation,
  identifyPlantationAddressByOwner,
  requestConsortiumApproval
} from "../../store/actions/plantation";
import { isZeroAddress } from "../../utils/mappings";
import { plantationOwner } from "../../store/models/authentication";
import { Button } from "@material-ui/core";
import "./plantation.css";
import TokenForm from "./TokenForm";

export class Plantation extends Component {
  componentDidMount() {
    console.log(this.props.plantationAddress);
    if (this.props.userAuthType !== plantationOwner) {
      return;
    }
    if (
      isZeroAddress(this.props.plantationAddress) ||
      this.props.plantationAddress == ""
    ) {
      this.props.onFetchPlantationAddress(
        this.props.userAddress,
        this.props.deployerAddress
      );
      return;
    }
    if (
      isZeroAddress(this.props.plantationAddress) ||
      this.props.plantationAddress === undefined
    ) {
      return;
    }
    this.props.onFetchPlantationInformation(
      this.props.plantationAddress,
      this.props.userAddress
    );
  }
  render() {
    let requestApprovalButton;
    if (
      !this.props.plantationInformation.approved &&
      !this.props.plantationInformation.pendingApproval
    ) {
      requestApprovalButton = (
        <div className="requestButtonContainer">
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              this.props.onRequestApproval(
                this.props.plantationAddress,
                this.props.userAddress
              )
            }
          >
            Request Approval
          </Button>
        </div>
      );
    } else if (this.props.plantationInformation.pendingApproval) {
      requestApprovalButton = (
        <div className="requestButtonContainer">
          <Button
            variant="outlined"
            color="primary"
            disabled
            onClick={() =>
              this.props.onRequestApproval(
                this.props.plantationAddress,
                this.props.userAddress
              )
            }
          >
            Plantation request is pending approval
          </Button>
        </div>
      );
    }

    return (
      <div>
        <TopBar title={"Plantation Overview"} />
        {this.props.userAuthType === plantationOwner ? (

          this.props.plantationInformation.approved ? <div> <TokenForm onSubmit={() => console.log("submittinh")} /></div> :
            requestApprovalButton
        ) : (
            <></>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  fruitTokens: state.plantationReducer.tokensSubmitted,
  userAuthType: state.authenticationReducer.authType,
  plantationAddress: state.plantationReducer.plantationAddress,
  userAddress: state.authenticationReducer.userAddress,
  deployerAddress: state.consortiumListReducer.consortiumDeployerAddress,
  plantationInformation: state.plantationReducer.plantationProperties
});

//Fetching approval status may be redundant, as the info lies in the plantation reducer already
const mapDispatchToProps = dispatch => ({
  onFetchPlantationInformation: (plantationAddress, userAddress) =>
    dispatch(fetchPlantationInformation(plantationAddress, userAddress)),
  onSubmitToken: (plantationAddress, tokenObject, userAddress) =>
    dispatch(submitFFBToken(tokenObject, userAddress)),
  onFetchPlantationAddress: (userAddress, deployerAddress) =>
    dispatch(identifyPlantationAddressByOwner(userAddress, deployerAddress)),
  onRequestApproval: (plantationAddress, userAddress) =>
    dispatch(requestConsortiumApproval(plantationAddress, userAddress))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plantation);
