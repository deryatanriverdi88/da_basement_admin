export default function favoriteCardsReducer(state=[], {type, payload}){
    switch (type) {
        case 'GET_FAVORITE_CARDS':
            return payload
        default:
            return state
    }
}