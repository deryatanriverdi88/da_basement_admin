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

    loginForm = () => {
        return (
            <form className="inputs"
                  onSubmit={this.handleSubmit}>
                <label htmlFor="email">
                    <span>E-mail : </span>
                    <input
                        type="text"
                        id="email"
                        value={this.state.email}
                        name="email"
                        onChange={this.handleChange}
                    />
                </label>
                <label htmlFor="password">
                    <span>Password : </span>
                    <input
                        type="password"
                        id="password"
                        value={this.state.password}
                        name="password"
                        onChange={this.handleChange}
                    />
                </label>
                <input type="submit" id="submit"/>
            </form>
        )
    }

    render() {
        return(
            <div className="login-container">
                <div className="login-form">
                    {this.state.errors}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        setUser: (admin) => {
            dispatch({
                type: 'SET_USER', payload: admin
            })
        }
    }
}

const mapStateToProps = (state)=>{
    return {
        current_user: state.user
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (Login))