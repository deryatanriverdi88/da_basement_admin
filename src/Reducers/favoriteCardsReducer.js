export default function favoriteCardsReducer(state={ favoriteCards: [], binderFavoriteCards: [], groupNames: [] }, {type, payload}){
    switch (type) {
        case 'SET_FAVORITE_CARDS':
            return {...state, favoriteCards: payload}
        case 'SET_BINDER_FAVORITE_CARDS':
            return {...state, binderFavoriteCards: payload}
        case 'SET_GROUP_NAMES':
            return {...state, groupNames: payload}
        case 'CLEAR_FAVORITE_CARDS':
            return []
        default:
            return state
    }
}