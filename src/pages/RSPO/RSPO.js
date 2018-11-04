import React, { Component } from 'react'

import { connect } from 'react-redux'
import { fetchRSPOAdministrator } from '../../store/actions/rspo';




class RSPO extends Component {


    async componentDidMount() {


        this.props.onFetchAdmin();

    }


    render() {
        return (
            <div>
                <button onClick={() => this.props.onFetchAdmin()}>jensen</button>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    adminAddress: state.rspoReducer.rspoAdministrator
})

const mapDispatchToProps = dispatch => ({

    onFetchAdmin: () => dispatch(fetchRSPOAdministrator())


});



export default connect(mapStateToProps, mapDispatchToProps)(RSPO)
