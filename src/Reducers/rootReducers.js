import { combineReducers } from 'redux'
import user from './userReducer'
import favoriteCards from './favoriteCardsReducer'
import addCards from './addCardReducer'
import addBinders from './addBinderReducer'

export default combineReducers({
    user: user,
    favoriteCards: favoriteCards,
    addCards: addCards
})