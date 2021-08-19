import { characters, story, summary } from "../../../utils/mock_data"

const init_state = [
    {
        name: 'Gia đình ngọt ngào',
        summary: summary,
        characters: characters,
        story: story,
    }
]


export default (state = init_state, action) => {
    switch (action.type) {
        case 'PUT_ON':
            const dup = state.find(val => val.name === action.payload.name)
            if(dup != undefined) {
                const newState = state.filter(val => val.name !== action.payload.name)
                return [...newState, action.payload]
            } else {
                return [...state, action.payload]
            }
        case 'DUMP':
            return state.filter(val => val.name !== action.payload)
        default:
            return state
    }
}