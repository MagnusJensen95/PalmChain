import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";

import "./plantation.css";

const ParameterChange = props => {
  return (
    <div className="plantationInfoContainer">
      <h3>Plantation information</h3>
      <div className="changeNameContainer">
        <TextField
          defaultValue={props.plantation.name}
          type="text"
          label="Plantation Name"
          disabled={!props.editing}
          onChange={e => props.onNameChange(e.target.value)}
        />
        <div className="editButton">
          <Button
            variant={props.editing ? "contained" : "outlined"}
            color="primary"
            onClick={() => props.onToggleEdit(!props.editing)}
          >
            {props.editing ? "SAVE" : "CHANGE"}
          </Button>
        </div>
      </div>
      <div className="addressContainer">
        <TextField
          value={props.plantation.address}
          type="text"
          fullWidth
          disabled
          label="Plantation Address"
        />
      </div>
    </div>
  );
};

export default ParameterChange;
