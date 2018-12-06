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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Owner</TableCell>
            <TableCell>Weight (kg)</TableCell>
            <TableCell>FFB Id's Included</TableCell>
            <TableCell>Processed</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.tokens.map((element, index) => {
            console.log(element);
            let includedTokenString = "[";

            for (let id of element.containedFFB) {
              includedTokenString += " " + id + ",";
            }
            includedTokenString = includedTokenString.substring(
              0,
              includedTokenString.length - 1
            );

            includedTokenString += " ]";
            return (
              <TableRow key={element.tokenId}>
                <TableCell>{element.owner}</TableCell>
                <TableCell>{element.weight}</TableCell>
                <TableCell>{includedTokenString}</TableCell>
                <TableCell>{element.processed ? "Yes" : "No"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CoTokenList;
