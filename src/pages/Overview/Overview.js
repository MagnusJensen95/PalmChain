import React, { Component } from 'react'

import { connect } from 'react-redux'
import web3 from '../../utils/getWeb3';
import { fetchConsortiumAddresses } from '../../store/actions/consortiumlist';

class Overview extends Component {


    async componentDidMount() {
        let address = await web3.eth.getAccounts()[0];
        this.props.onFetchConsortiumList(address)
    }

    render() {
        return (
            <div>
                Overview
      </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => {
    return {
        onFetchConsortiumList: (userAddress) => dispatch(fetchConsortiumAddresses(userAddress))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Overview)
