import React, { Component } from "react";

import { connect } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";
import CoTokenList from "./CoTokenList";
import {
  fetchPossibleTokens,
  createCoToken,
  getCoTokensCreated
} from "../../store/actions/mill";
import { millOwner } from "../../store/models/authentication";
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
  ListItem,
  Checkbox,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";

import "./mill.css";

export class Mill extends Component {
  state = {
    selectedTokens: new Map()
  };

  onSelectToken(key) {
    console.log(key);
    let currentState = this.state.selectedTokens.get(key);
    if (currentState === undefined) {
      this.state.selectedTokens.set(key, false);
    }
    let toggle = !this.state.selectedTokens.get(key);
    this.setState(prevState => ({
      selectedTokens: prevState.selectedTokens.set(key, toggle)
    }));
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
                handleTokenSelection={key => this.onSelectToken(key)}
                selectedTokens={this.state.selectedTokens}
                handleTokenCreation={() =>
                  this.props.onCoTokenCreation(
                    this.props.possibleTokens.length,
                    this.state.selectedTokens
                  )
                }
                tokens={this.props.possibleTokens}
              />
            </div>
            <div className="coTokenListContainer">
              <CoTokenList tokens={this.props.coTokens} />
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
    <div className="tokenCreationPanel">
      <ExpansionPanel disabled={props.millAddress === ""}>
        <ExpansionPanelSummary>
          <Typography>Create Crude Oil Token</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className="wideList">
            <List>
              {props.tokens.map((element, index) => (
                <ListItem>
                  <ListItemText primary={element} />

                  <ListItemSecondaryAction>
                    <Checkbox
                      onClick={() => props.handleTokenSelection(element)}
                      checked={props.selectedTokens.get(element)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}

              <Button
                onClick={() => props.handleTokenCreation()}
                variant="contained"
                color="primary"
              >
                Create
              </Button>
            </List>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

const mapStateToProps = state => ({
  coTokens: state.millReducer.coTokens,
  possibleTokens: state.millReducer.possibleTokens,
  authType: state.authenticationReducer.authType
});

const mapDispatchToProps = dispatch => ({
  onCoTokenCreation: (length, map) => dispatch(createCoToken(length, map)),
  onFetchCoTokens: () => dispatch(getCoTokensCreated()),
  onFetchPossibleTokens: () => dispatch(fetchPossibleTokens())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mill);
