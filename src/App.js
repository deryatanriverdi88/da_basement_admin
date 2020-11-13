import React, {useEffect} from 'react';
import Routes from './Routes'
import {withRouter} from 'react-router-dom'
// import './App.css';
import './STYLES/style.css'
import {connect} from 'react-redux'
import NavBar from './Components/NavBar'

function App(props) {
  useEffect(() => {
    fetch("https://da-basement-games-api.herokuapp.com/profile", {
      headers: {
        Authorization: localStorage.token
      }
    })
    .then(res => res.json())
    .then(userObject => {
      props.setUser(userObject)
    })
    fetch('https://da-basement-games-api.herokuapp.com/binders')
    .then(res => res.json())
    .then(binderObj => {
      props.setBinders(binderObj)
    })
    fetch('https://da-basement-games-api.herokuapp.com/favorite_cards')
    .then(res => res.json())
    .then(cardItems => {

      props.setFavoriteCards(cardItems)
      let groupNames = []
      cardItems.filter(card => {
        groupNames.push(card.group_name)
      })
      let removedDublicates = [...new Set(groupNames)]
      props.setGroupNames(removedDublicates.sort((a,b) => a > b ? 1 : -1))
    })
    fetch('https://da-basement-magic-cards-api.herokuapp.com/last_ten')
    .then(res => res.json())
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
    },
    setFavoriteCards: (cardObject) => {
      dispatch({
        type: 'SET_FAVORITE_CARDS', payload: cardObject
      })
    },
    setBinders: (binderObject) => {
      dispatch({
        type: 'SET_BINDERS', payload: binderObject
      })
    }
  }
}

export default withRouter(connect(null, mapDispatchToProps)(App));