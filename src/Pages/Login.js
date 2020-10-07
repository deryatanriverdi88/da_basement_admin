import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'

class Login extends Component {
    state={
        email: "",
        password: "",
        errors: ""
    }

    render() {
        return(
            <div className="login-container">
                <div className="login-form">
                </div>
            </div>
        )
    }
}

export default Login