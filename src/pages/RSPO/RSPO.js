import React, { Component } from "react";

import { connect } from "react-redux";
import {
  fetchRSPOAdministrator,
  approvePlantationRequest,
  revokePlantationAccess
} from "../../store/actions/rspo";
import TopBar from "../../components/TopBar/TopBar";
import "./rspo.css";
import {
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  List,
  ListItem
} from "@material-ui/core";
import { rspoAdmin } from "../../store/models/authentication";
import { setMillAddress } from "../../store/actions/mill";

class RSPO extends Component {
  state = {
    millAddress: ""
  };
  async componentDidMount() {
    if (this.props.consortiumDeployerAddress !== "") {
      // this.props.onFetchAdmin();
    }
  }

  //  <List>{plantationList}</List>
  render() {
    return (
      <div>
        <TopBar
          title={"Plantations and active Mill related to selected consortium"}
        />

        {this.props.authType === rspoAdmin ? (
          <div>
            <Paper>
              <PlantationTable
                className="plantationTable"
                onApproveRequest={address =>
                  this.props.onApproveRequest(address)
                }
                plantationInstances={this.props.plantationObjects}
                onRevokeAccess={plantationAddress =>
                  this.props.revokePlantationAddress(plantationAddress)
                }
              />
            </Paper>
            <MillSetter
              onSetMillAddress={address => {
                this.setState({ millAddress: "" });
                this.props.onSetMillAddress(address);
              }}
              onMillChange={text => this.setState({ millAddress: text })}
              millAddressValue={this.state.millAddress}
              {...this.props.activeMill}
            />
          </div>
        ) : (
          <div>You must sign in as RSPO administrator to view this page</div>
        )}
      </div>
    );
  }
}

function MillSetter(props) {
  return (
    <div className="millSectionContainer">
      <div className="millDescriptionContainer">
        <ExpansionPanel disabled={props.millAddress === ""}>
          <ExpansionPanelSummary>
            <Typography>Current Mill Information</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List>
              <ListItem>
                <Typography>Mill name: {props.millName}</Typography>
              </ListItem>
              <ListItem>
                <Typography>GPS Longitude: {props.GPSLongitude}</Typography>
              </ListItem>
              <ListItem>
                <Typography>GPS Latitude: {props.GPSLatitude}</Typography>
              </ListItem>
              <ListItem>
                <Typography>Mill Address: {props.millAddress}</Typography>
              </ListItem>
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
      <div className="millSetterContainer">
        <div className="millSetterSubContainer">
          <TextField
            value={props.millAddressValue}
            fullWidth
            label="Set Mill Address of selected consortium"
            onChange={e => props.onMillChange(e.target.value)}
          />
        </div>
        <div className="millSetterSubContainer">
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.onSetMillAddress(props.millAddressValue)}
          >
            save
          </Button>
        </div>
      </div>
    </div>
  );
}

function PlantationTable(props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Address</TableCell>
          <TableCell>Approved</TableCell>
          <TableCell>Pending Approval</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {props.plantationInstances.map((element, index) => {
          let approvedCell = <></>;
          if (element.approved) {
            approvedCell = (
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => props.onRevokeAccess(element.address)}
              >
                Revoke Approval
              </Button>
            );
          } else {
            approvedCell = element.pendingApproval ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => props.onApproveRequest(element.address)}
              >
                Approve
              </Button>
            ) : (
              <div>No approval requested</div>
            );
          }
          return (
            <TableRow key={element.address}>
              <TableCell>{element.name}</TableCell>
              <TableCell>{element.address}</TableCell>
              <TableCell>{element.approved ? "Yes" : "No"}</TableCell>
              <TableCell>{approvedCell}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

const mapStateToProps = state => ({
  adminAddress: state.rspoReducer.rspoAdministrator,
  consortiumDeployerAddress:
    state.consortiumListReducer.consortiumDeployerAddress,
  authType: state.authenticationReducer.authType,
  plantationObjects: state.consortiumListReducer.plantationObjects,
  consortiumAddress: state.consortiumListReducer.selectedConsortiumAddress,
  activeMill: { ...state.millReducer }
});

const mapDispatchToProps = dispatch => ({
  onFetchAdmin: deployerAddress =>
    dispatch(fetchRSPOAdministrator(deployerAddress)),
  onApproveRequest: plantationAddress =>
    dispatch(approvePlantationRequest(plantationAddress)),
  revokePlantationAddress: plantationAddress =>
    dispatch(revokePlantationAccess(plantationAddress)),
  onSetMillAddress: address => dispatch(setMillAddress(address))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RSPO);
