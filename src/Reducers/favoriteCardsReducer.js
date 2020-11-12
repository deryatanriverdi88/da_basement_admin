export default function favoriteCardsReducer(state={ favoriteCards: [], binderFavoriteCards: [] }, {type, payload}){
    switch (type) {
        case 'SET_FAVORITE_CARDS':
            return {...state, favoriteCards: payload}
        case 'SET_BINDER_FAVORITE_CARDS':
                return {...state, binderFavoriteCards: payload}
        case 'CLEAR_FAVORITE_CARDS':
            return []
        default:
            return state
    }
}