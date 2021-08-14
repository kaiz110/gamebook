

export default (state = [], action) => {
    switch (action.type) {
        case 'PUT_ON':
            const dup = state.find(val => val.name === action.payload.name)
            if(dup != undefined) {
                const newState = state.filter(val => val.name !== action.payload.name)
                return [...newState, action.payload]
            } else {
                return [...state, action.payload]
            }
        default:
            return state
    }
}