import React, { Component } from "react";

import { connect } from "react-redux";
import web3 from "../../utils/getWeb3";
import {
  fetchConsortiumAddresses,
  setSelectedConsortiumAddress
} from "../../store/actions/consortiumlist";
import { ListItem, List, ListItemText } from "@material-ui/core";
import TopBar from "../../components/TopBar/TopBar";

class Overview extends Component {
  componentDidMount() {
    let address = web3.eth.getAccounts()[0];
    this.props.onFetchConsortiumList(address);
  }

  render() {
    return (
      <div>
        <TopBar title={"Consortium instance overview"} />
        <List>
          {this.props.consortiumList.map((element, index) => (
            <ListItem
              button
              onClick={() => this.props.onSetConsortiumAddress(element)}
            >
              <ListItemText primary={element} />
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  consortiumList: state.consortiumListReducer.consortiumList
});

const mapDispatchToProps = dispatch => ({
  onSetConsortiumAddress: consortiumAddress =>
    dispatch(setSelectedConsortiumAddress(consortiumAddress)),
  onFetchConsortiumList: userAddress =>
    dispatch(fetchConsortiumAddresses(userAddress))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Overview);
