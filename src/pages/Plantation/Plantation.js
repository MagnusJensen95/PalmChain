import React, { Component } from "react";

import { connect } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";
import {
  submitFFBToken,
  fetchPlantationInformation,
  identifyPlantationAddressByOwner,
  requestConsortiumApproval,
  setPlantationName,
  fetchTokensSubmitted
} from "../../store/actions/plantation";
import { isZeroAddress } from "../../utils/mappings";
import { plantationOwner } from "../../store/models/authentication";
import { Button, Paper } from "@material-ui/core";
import "./plantation.css";
import TokenForm from "./TokenForm";
import ParameterChange from "./ParameterChange";

import FruitTokenTable from "./TokenList";

export class Plantation extends Component {
  state = {
    newPlantationProps: {
      name: "",
      longitude: "",
      latitude: ""
    },
    tokenProps: {
      weight: 0,
      timeStamp: 0
    },

    localName: "",
    editing: false
  };

  onTokenSubmission() {
    let weight = this.state.tokenProps.weight;
    let date = this.state.tokenProps.timeStamp;

    let convertedDate = new Date(date).getTime();

    if (weight > 0 && convertedDate > 0) {
      this.props.onSubmitToken(weight, convertedDate);
      this.setState({
        tokenProps: { ...this.state.tokenProps, weight: 0, timeStamp: 0 }
      });
    }
  }

  componentDidMount() {
    if (this.props.userAuthType !== plantationOwner) {
      return;
    }
    if (
      isZeroAddress(this.props.plantationAddress) ||
      this.props.plantationAddress === ""
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

  handleEditToggle(editing) {
    //Editing = true meaning: we are now in editing
    // state and no call to contract should be made

    this.setState({ editing: editing });
    if (editing === false) {
      this.props.onChangePlantationName(this.state.localName);
    }
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
        <TopBar title={"Plantation Dashboard"} />
        {this.props.userAuthType === plantationOwner ? (
          this.props.plantationInformation.approved ? (
            <div className={"plantationMainContainer"}>
              <div className={"plantationTopContainer"}>
                <div className={"plantationLeftSubContainer"}>
                  <ParameterChange
                    onNameChange={value => this.setState({ localName: value })}
                    onToggleEdit={edit => this.handleEditToggle(edit)}
                    editing={this.state.editing}
                    plantation={this.props.plantationInformation}
                  />
                </div>

                <div className={"plantationRightSubContainer"}>
                  <TokenForm
                    weight={this.state.tokenProps.weight}
                    date={this.state.tokenProps.timeStamp}
                    onSubmitToken={() => this.onTokenSubmission()}
                    onSetBatchWeight={weight =>
                      this.setState({
                        tokenProps: { ...this.state.tokenProps, weight: weight }
                      })
                    }
                    onSetHarvestDate={timeStamp =>
                      this.setState({
                        tokenProps: {
                          ...this.state.tokenProps,
                          timeStamp: timeStamp
                        }
                      })
                    }
                  />
                </div>
              </div>
              <div className={"plantationBottomContainer"}>
                <Paper>
                  <h3 className="tableHeader">Tokens Submitted:</h3>
                  {<FruitTokenTable tokens={this.props.ffbTokens} />}
                </Paper>
              </div>
            </div>
          ) : (
              requestApprovalButton
            )
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
  plantationInformation: state.plantationReducer.plantationProperties,
  ffbTokens: state.plantationReducer.tokensSubmitted
});

//Fetching approval status may be redundant, as the info lies in the plantation reducer already
const mapDispatchToProps = dispatch => ({
  onFetchPlantationInformation: (plantationAddress, userAddress) =>
    dispatch(fetchPlantationInformation(plantationAddress, userAddress)),
  onSubmitToken: (weight, date) => dispatch(submitFFBToken(weight, date)),
  onFetchPlantationAddress: (userAddress, deployerAddress) =>
    dispatch(identifyPlantationAddressByOwner(userAddress, deployerAddress)),
  onRequestApproval: (plantationAddress, userAddress) =>
    dispatch(requestConsortiumApproval(plantationAddress, userAddress)),
  onChangePlantationName: name => dispatch(setPlantationName(name)),
  onFetchTokens: () => dispatch(fetchTokensSubmitted())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Plantation);
