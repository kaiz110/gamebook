

export default (state = [], action) => {
    switch (action.type) {
        case 'PUT_ON':
            const dup = state.find(val => {
                if(val.name === action.payload.name && val.summary === action.payload.summary) return true
                else return false
            })
            if(dup != undefined) {
                const newState = state.filter(val => val.name !== action.payload.name && val.summary !== action.payload.summary)
                return [...newState, action.payload]
            } else {
                return [...state, action.payload]
            }
        default:
            return state
    }
}