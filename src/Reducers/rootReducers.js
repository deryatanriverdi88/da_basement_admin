import { combineReducers } from 'redux'
import user from './userReducer'
import favoriteCards from './favoriteCardsReducer'
import addCards from './addCardReducer'

export default combineReducers({
    user: user,
    favoriteCards: favoriteCards,
    addCards: addCards
})