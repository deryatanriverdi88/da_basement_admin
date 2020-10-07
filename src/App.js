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
    </div>
  );
}

export default App;