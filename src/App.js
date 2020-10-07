import React, {} from 'react';
import Routes from './Routes'
import {withRouter} from 'react-router-dom'
import './App.css';
import {connect} from 'react-redux'
import NavBar from './Components/NavBar'

function App(props) {
  useEffect(() => {
    fetch("http://localhost:3000/profile", {
      headers: {
        Authorization: localStorage.token
      }
    })
    .then(res => res.json())
    .then(userObject => {
      props.setUser(userObject)
    })
  }, [props])

  return (
    <div className="App">
        <NavBar/>
        <Routes/>
    </div>
  );
}

const mapDispatchToProps = (dispatch) =>{
  return {
    setUser: (userObject) => {
      dispatch({
          type: 'SET_USER', payload: userObject
        })
    }
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));