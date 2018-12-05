import React, { Component } from "react";

import { connect } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";
import CoTokenList from "./CoTokenList";
import { fetchPossibleTokens, createCoToken } from "../../store/actions/mill";
import { millOwner } from "../../store/models/authentication";
import { Button } from "@material-ui/core";

export class Mill extends Component {
  render() {
    return (
      <div>
        <TopBar title={"Mill Information"} />

        {this.props.authType === millOwner ? (
          <div>
            <div className="coTokenCreationContainer">
              <CoTokenCreator
                handleTokenCreation={indexes =>
                  this.props.onCoTokenCreation(indexes)
                }
              />
            </div>
            <div className="coTokenListContainer">
              <CoTokenList
                handleFetch={() => this.props.onFetchRawTokens()}
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
        onClick={() => props.handleTokenCreation([0, 1])}
        variant="outlined"
        color="primary"
      >
        Create Token
      </Button>
    </div>
  );
};

const mapStateToProps = state => ({
  coTokens: state.millReducer.coTokens,
  authType: state.authenticationReducer.authType
});

const mapDispatchToProps = dispatch => ({
  onFetchRawTokens: () => dispatch(fetchPossibleTokens()),
  onCoTokenCreation: indexes => dispatch(createCoToken(indexes))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mill);
