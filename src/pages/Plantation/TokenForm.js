import React, { Component } from "react";
import { Button, TextField } from "@material-ui/core";

const TokenForm = props => {
  return (
    <div className="ffbFormContainer">
      <h3>Submit new FFB token</h3>
      <TextField
        value={props.date}
        type="date"
        label="Select date of harvest"
        onChange={e => props.onSetHarvestDate(e.target.value)}
        InputLabelProps={{
          shrink: true
        }}
      />
      <TextField
        value={props.weight}
        type="number"
        label="Set batch weight (kg)"
        onChange={e => props.onSetBatchWeight(e.target.value)}
        InputLabelProps={{
          shrink: true
        }}
      />

      <Button
        onClick={() => props.onSubmitToken()}
        variant="contained"
        color="primary"
      >
        Submit Token
      </Button>
    </div>
  );
};

export default TokenForm;
