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
        fetch('https://da-basement-games-api.herokuapp.com/login', {
        // fetch('http://localhost:5000/login', {
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
                if(admin.error){
                    this.setState({
                        errors: admin.error
                    })
                } else if(admin.current_user.id) {
                    if(admin.current_user.role === "admin"){
                        localStorage.setItem('token', admin.token)
                        this.props.setUser(admin.current_user)
                        this.props.history.push('/myCards')
                    }  else {
                        this.setState({
                            errors: "This is admin page, you have no permission to login."
                        })
                    }
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
                    {this.loginForm()}
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