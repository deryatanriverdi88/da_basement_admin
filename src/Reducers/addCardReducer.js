export default function addCardReducer(state=[], {type, payload}){
    switch (type) {
        case 'GET_CARDS':
            return payload
        case 'CLEAR_CARDS':
            return []
        default:
            return state
    }
}