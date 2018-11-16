import React, { Component } from "react";

import { connect } from "react-redux";
import { fetchRSPOAdministrator } from "../../store/actions/rspo";
import TopBar from "../../components/TopBar/TopBar";

class RSPO extends Component {
  async componentDidMount() {
    if (this.props.consortiumDeployerAddress !== "") {
      // this.props.onFetchAdmin();
    }

  }

  render() {
    return (
      <div>
        <TopBar title={"RSPO Administrator page"} />
        <button onClick={() => this.props.onFetchAdmin()}>jensen</button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  adminAddress: state.rspoReducer.rspoAdministrator,
  consortiumDeployerAddress: state.consortiumListReducer.consortiumDeployerAddress
});

const mapDispatchToProps = dispatch => ({
  onFetchAdmin: (deployerAddress) => dispatch(fetchRSPOAdministrator(deployerAddress))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RSPO);
