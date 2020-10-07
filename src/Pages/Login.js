import React, { Component } from 'react'
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'

class Login extends Component {
    state={
        email: "",
        password: "",
        errors: ""
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        fetch('http://localhost:3000/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(res => res.json())
        .then(admin => {
            console.log(admin)
            localStorage.setItem('token', admin.token)
            if(admin.token){
                this.props.setUser(admin.current_user)
                this.props.history.push('/myCards')
            } else {
                this.setState({
                    errors: admin.error
                })
            }
        })
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