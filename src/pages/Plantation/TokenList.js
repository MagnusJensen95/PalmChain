import React, { Component } from 'react'

import {

    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,

} from "@material-ui/core";

const FruitTokenTable = (props) => {
    return (
        <Table >
            <TableHead>
                <TableRow>
                    <TableCell>Harvest Date</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Processed</TableCell>
                    <TableCell>Id</TableCell>
                    <TableCell>Weight (kg)</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.tokens.map((element, index) => {
                    let millis = parseInt(element.harvestTimeStamp);
                    let date = new Date(millis);
                    let dateString = date.getDay();
                    dateString += "/" + date.getMonth();

                    dateString += "/" + date.getFullYear();

                    return (
                        <TableRow key={element.tokenId}>
                            <TableCell>{dateString}</TableCell>
                            <TableCell>{element.owner}</TableCell>
                            <TableCell>{element.processed ? "Yes" : "No"}</TableCell>
                            <TableCell>{element.tokenId}</TableCell>
                            <TableCell>{element.weight}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}


export default FruitTokenTable;