import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { setDrawerOpen } from "../../store/actions/ui";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { Button } from "@material-ui/core";
import "./topbar.css";

class TopBar extends Component {
  render() {
    return (
      <div className="root">
        <AppBar position="static">
          <Toolbar>
            <IconButton
              className="menuButton"
              color="inherit"
              aria-label="Menu"
              onClick={() => this.props.onToggleDrawer(!this.props.drawerOpen)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" className="grow">
              {this.props.title}
            </Typography>
            {this.props.children}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userAuthenticated: state.authenticationReducer.authorized,
  drawerOpen: state.uiReducer.drawerStatus
});

const mapDispatchToProps = dispatch => {
  return {
    onToggleDrawer: opened => dispatch(setDrawerOpen(opened))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopBar);
