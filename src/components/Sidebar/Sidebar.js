import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ListSubheader, Button, IconButton } from "@material-ui/core";
import { setDrawerOpen } from "../../store/actions/ui";
import ArrowLeft from "@material-ui/icons/ArrowLeft";

const styles = theme => ({
  button: {
    width: "100px"
  },
  titleItem: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontSize: 18
  },
  titleItemText: {
    background: theme.palette.primary.contrastText
  },
  grow: {
    flexGrow: 1
  },
  navbar: {
    width: "250px"
  },
  list: {
    background: theme.palette.secondary
  },
  navlink: {
    textDecoration: "none"
  }
});

class TemporaryDrawer extends React.Component {
  render() {
    const { classes } = this.props;
    const tabs = ["RSPO", "Plantation", "Mill"];
    const sideList = (
      <div className={classes.list}>
        <List
          subheader={
            <Link to={"/"} className={classes.navlink}>
              <ListSubheader className={classes.titleItem}>
                Palm Chain
              </ListSubheader>
            </Link>
          }
        >
          {tabs.map((text, index) => (
            <Link to={text} className={classes.navlink}>
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            </Link>
          ))}
          <Divider />

          <Link to="/login" className={classes.navlink}>
            <ListItem button>
              <ListItemText
                primary={this.props.userAuthenticated ? "Log Out" : "Log In"}
              />
            </ListItem>
          </Link>

          <IconButton onClick={() => this.props.onToggleDrawer(false)}>
            <ArrowLeft />
          </IconButton>
        </List>
      </div>
    );
    return (
      <Drawer
        anchor="left"
        variant="persistent"
        open={this.props.drawerOpen}
        classes={{
          paper: classes.navbar
        }}
      >
        {sideList}
      </Drawer>
    );
  }
}

const styledDrawer = withStyles(styles)(TemporaryDrawer);

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
)(styledDrawer);
