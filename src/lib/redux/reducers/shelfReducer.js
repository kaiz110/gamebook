import { characters, story, summary } from "../../../utils/mock_data"

const init_state = [
    {
        name: 'Gia đình ngọt ngào',
        summary: summary,
        characters: characters,
        story: story,
        currentPage: 1
    }
]


export default (state = init_state, action) => {
    switch (action.type) {
        case 'PUT_ON':
            const dup = state.find(val => val.name === action.payload.name)
            if(dup != undefined) {
                const newState = state.filter(val => val.name !== action.payload.name)
                return [...newState, {...action.payload, ...{currentPage: 1}}]
            } else {
                return [...state, {...action.payload, ...{currentPage: 1}}]
            }
        case 'DUMP':
            return state.filter(val => val.name !== action.payload)
        case 'BOOKMARK':
            return state.map(val => {
                if(val.name === action.payload.name) {
                    return {...val, ...{currentPage: action.payload.page}}
                } else return val
            })
        default:
            return state
    }
}