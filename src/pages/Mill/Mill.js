import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TopBar from "../../components/TopBar/TopBar";

export class Mill extends Component {
  render() {
    return (
      <div>
        <TopBar title={"Mill Information"} />
      </div>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mill);
