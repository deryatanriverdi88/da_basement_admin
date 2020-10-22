export default function addBinderReducer(state=[], {type, payload}){
    switch (type) {
        case 'SET_BINDERS':
            return payload
        case 'CLEAR_BINDER':
            return []
        default:
            return state
    }
}