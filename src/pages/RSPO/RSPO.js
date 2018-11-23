import React, { Component } from "react";

import { connect } from "react-redux";
import {
  fetchRSPOAdministrator,
  approvePlantationRequest
} from "../../store/actions/rspo";
import TopBar from "../../components/TopBar/TopBar";
import "./rspo.css";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  List,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@material-ui/core";
import { rspoAdmin } from "../../store/models/authentication";

class RSPO extends Component {
  async componentDidMount() {
    if (this.props.consortiumDeployerAddress !== "") {
      // this.props.onFetchAdmin();
    }
  }

  //  <List>{plantationList}</List>
  render() {
    return (
      <div>
        <TopBar title={"Plantations related to selected consortium"} />

        <Paper>
          {this.props.authType == rspoAdmin ? (
            <PlantationTable
              className="plantationTable"
              onApproveRequest={address => this.props.onApproveRequest(address)}
              plantationInstances={this.props.plantationObjects}
            />
          ) : (
            <div>You must sign in as RSPO administrator to view this page</div>
          )}
        </Paper>
      </div>
    );
  }
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
              <Button variant="outlined" color="secondary">
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
  consortiumAddress: state.consortiumListReducer.selectedConsortiumAddress
});

const mapDispatchToProps = dispatch => ({
  onFetchAdmin: deployerAddress =>
    dispatch(fetchRSPOAdministrator(deployerAddress)),
  onApproveRequest: plantationAddress =>
    dispatch(approvePlantationRequest(plantationAddress))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RSPO);
