import React, { Component } from "react";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from "@material-ui/core";

const CoTokenList = props => {
  return (
    <div>
      <Button onClick={() => props.handleFetch()}>CLICK ME</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Owner</TableCell>
            <TableCell>Weight (kg)</TableCell>
            <TableCell>Tokens Included</TableCell>
            <TableCell>Processed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.tokens.map((element, index) => {
            return (
              <TableRow key={element.tokenId}>
                <TableCell>{element.owner}</TableCell>
                <TableCell>{element.weight ? "Yes" : "No"}</TableCell>
                <TableCell>{"Tokens"}</TableCell>
                <TableCell>{element.processed}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoTokenList;
