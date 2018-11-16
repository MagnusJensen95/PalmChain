import React, { Component } from "react";

import { connect } from "react-redux";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  ListSubheader
} from "@material-ui/core";
import {
  fetchAvailableAccounts,
  setCurrentUserAddress,
  authenticateUserAsType,
  signUserOut
} from "../../store/actions/authentication";
import web3 from "../../utils/getWeb3";
import "./login.css";
import {
  plantationOwner,
  unauthorizedUser,
  rspoAdmin,
  millOwner
} from "../../store/models/authentication";

import TopBar from "../../components/TopBar/TopBar";
export class Login extends Component {
  state = {
    typeSelected: false,
    authType: rspoAdmin,
    selectedIndex: 0
  };

  componentDidMount() {
    this.props.onSetCurrentAccounts();
  }

  loginWithType = userAddress => {
    if (this.props.selectedConsortiumAddress === "") {
      alert(
        "No consortium address has been selected. Please select an address at the home page."
      );
      this.props.history.push("/");
      return;
    }
    this.props.onSelectUserAddress(userAddress);
    this.props.onLoginAttempt(
      this.state.authType,
      userAddress,
      this.props.selectedConsortiumAddress
    );
  };

  render() {
    const authtypes = [plantationOwner, millOwner, rspoAdmin];
    const title = this.props.userAuthenticated
      ? "Signed in as " + this.props.userType
      : "Sign In";
    const signOutButton = this.props.userAuthenticated ? (
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => this.props.onLogoutAttempt()}
      >
        Sign Out
      </Button>
    ) : (
        <></>
      );
    return (
      <div>
        <TopBar title={title}>{signOutButton}</TopBar>
        <div className="signInContent">
          {!this.props.userAuthenticated ? (
            <div>
              <TypePicker
                options={authtypes}
                selectedIndex={this.state.selectedIndex}
                onTypeSelected={(index, element) => {
                  this.setState({ selectedIndex: index, authType: element });
                }}
              />
              <UserList
                {...this.props}
                selectUser={userAddress => this.loginWithType(userAddress)}
              />
            </div>
          ) : (
              <></>
            )}
        </div>
      </div>
    );
  }
}

const TypePicker = props => {
  return (
    <div>
      <List className={"optionsList"}>
        {props.options.map((element, index) => (
          <ListItem>
            <Button
              variant={props.selectedIndex === index ? "contained" : "outlined"}
              color="primary"
              onClick={() => props.onTypeSelected(index, element)}
            >
              {element}
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const UserList = props => {
  return (
    <List
      subheader={
        <ListSubheader disableSticky>
          Choose Address with which you wish to sign in
        </ListSubheader>
      }
    >
      {props.userAccounts.map((element, index) => (
        <ListItem
          button
          onClick={() => {
            props.selectUser(element);
          }}
        >
          <ListItemText primary={index + ": " + element} />
        </ListItem>
      ))}
    </List>
  );
};

const mapStateToProps = state => ({
  userAccounts: state.authenticationReducer.accounts,
  userAuthenticated: state.authenticationReducer.authorized,
  userType: state.authenticationReducer.authType,
  selectedConsortiumAddress: state.consortiumListReducer.selectedAddress
});

const mapDispatchToProps = dispatch => ({
  onLoginAttempt: (type, userAddress, consortiumAddress) =>
    dispatch(authenticateUserAsType(type, userAddress, consortiumAddress)),
  onSetCurrentAccounts: () => dispatch(fetchAvailableAccounts()),
  onSelectUserAddress: address => dispatch(setCurrentUserAddress(address)),
  onLogoutAttempt: () => dispatch(signUserOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
