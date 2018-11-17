import React, { Component } from "react";

import { connect } from "react-redux";
import { fetchRSPOAdministrator } from "../../store/actions/rspo";
import TopBar from "../../components/TopBar/TopBar";
import './rspo.css'
import { ListItem, ListItemText, ListItemSecondaryAction, Checkbox, List } from "@material-ui/core";

class RSPO extends Component {
  async componentDidMount() {
    if (this.props.consortiumDeployerAddress !== "") {
      // this.props.onFetchAdmin();
    }

  }

  render() {

    const plantationList = this.props.plantationAddresses.map((element, index) =>

      <ListItem button onClick={() => { }}>
        <ListItemText primary={element} />
        <ListItemSecondaryAction>
          <Checkbox checked={false} />
        </ListItemSecondaryAction>
      </ListItem>
    )
    return (
      <div>
        <TopBar title={"RSPO Administrator page"} />
        <List>{plantationList}</List>

      </div>
    );
  }
}

const mapStateToProps = state => ({
  adminAddress: state.rspoReducer.rspoAdministrator,
  consortiumDeployerAddress: state.consortiumListReducer.consortiumDeployerAddress,
  plantationAddresses: state.consortiumListReducer.plantationList,
  plantationObjects: state.consortiumListReducer.plantationObjects
});

const mapDispatchToProps = dispatch => ({
  onFetchAdmin: (deployerAddress) => dispatch(fetchRSPOAdministrator(deployerAddress))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RSPO);
