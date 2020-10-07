export default function addCardReducer(state=[], {type, payload}){
    switch (type) {
        case 'GET_CARDS':
            return payload
        default:
            return state
    }
}