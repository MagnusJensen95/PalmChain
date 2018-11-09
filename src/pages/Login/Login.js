import React, { Component } from 'react'

import { connect } from 'react-redux'
import { Button, List, ListItem, ListItemText, ListSubheader } from '@material-ui/core'
import { fetchAvailableAccounts, setCurrentUserAddress } from '../../store/actions/authentication';
import web3 from '../../utils/getWeb3';
import './login.css'
import { plantationOwner, unauthorizedUser, rspoAdmin, millOwner } from "../../store/models/authentication";
export class Login extends Component {


    state = {
        typeSelected: false,
        authType: "",
        selectedIndex: 0
    }

    componentDidMount() {


        this.props.onSetCurrentAccounts()
    }


    render() {

        const authtypes = [plantationOwner, millOwner, rspoAdmin];
        return (<div>
            {
                !this.props.userAuthenticated ? (<div>
                    <TypePicker options={authtypes} />
                    <UserList {...this.props} />
                </div>) : <></>
            }
        </div>
        )
    }
}

const TypePicker = (props) => {
    return (<div>
        Sign In as:
        <List className={'optionsList'}>

            {props.options.map((element, index) => (
                <ListItem >
                    <Button className={props.activeIndex === index ? "activeButton" : "in"} variant="outlined" color="primary">{element}</Button>
                </ListItem>
            ))

            }
        </List>
    </div>
    )
}

const UserList = (props) => {
    return (
        <List subheader={

            <ListSubheader disableSticky>Choose Address with which you wish to sign in</ListSubheader>
        }>
            {props.userAccounts.map((element, index) =>
                (<ListItem button onClick={() => props.onSelectUserAddress(element)}>
                    <ListItemText primary={index + ": " + element} />
                </ListItem>)
            )}
        </List>)
}

const mapStateToProps = (state) => ({
    userAccounts: state.authenticationReducer.accounts,
    userAuthenticated: state.authenticationReducer.authorized,
    userType: state.authenticationReducer.authType
})

const mapDispatchToProps = dispatch => ({
    onSetCurrentAccounts: () => dispatch(fetchAvailableAccounts()),
    onSelectUserAddress: (address) => dispatch(setCurrentUserAddress(address))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login)
