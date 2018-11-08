import React, { Component } from 'react'

import { connect } from 'react-redux'
import { Button } from '@material-ui/core'


export class Login extends Component {


    render() {
        return (
            <div>
                <Button>Jens</Button>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
