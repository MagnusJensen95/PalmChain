import React, { Component } from "react";

import { connect } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";
import CoTokenList from "./CoTokenList";
import { fetchPossibleTokens, createCoToken, getCoTokensCreated } from "../../store/actions/mill";
import { millOwner } from "../../store/models/authentication";
import { Button } from "@material-ui/core";

import './mill.css'

export class Mill extends Component {

  state = {

    selectedTokens: []
  }

  componentDidMount() {
    if (this.props.authType !== millOwner) {
      return;
    }

    this.props.onFetchCoTokens();
    this.props.onFetchPossibleTokens();
  }

  render() {
    return (
      <div>
        <TopBar title={"Mill Information"} />

        {this.props.authType === millOwner ? (
          <div className="grandMillContainer">
            <div className="coTokenCreationContainer">
              <CoTokenCreator
                selectedTokens={this.state.selectedTokens}
                handleTokenCreation={indexes =>
                  this.props.onCoTokenCreation(indexes)
                }
              />
            </div>
            <div className="coTokenListContainer">
              <CoTokenList
                tokens={this.props.coTokens}
              />
            </div>
          </div>
        ) : (
            <div />
          )}
      </div>
    );
  }
}

const CoTokenCreator = props => {
  return (
    <div>
      <Button
        onClick={() => props.handleTokenCreation(props.selectedTokens)}
        variant="contained"
        color="primary"
      >
        Create Crude Oil Token
      </Button>
    </div>
  );
};

const mapStateToProps = state => ({
  coTokens: state.millReducer.coTokens,
  authType: state.authenticationReducer.authType
});

const mapDispatchToProps = dispatch => ({
  onCoTokenCreation: indexes => dispatch(createCoToken(indexes)),
  onFetchCoTokens: () => dispatch(getCoTokensCreated()),
  onFetchPossibleTokens: () => dispatch(fetchPossibleTokens())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mill);
