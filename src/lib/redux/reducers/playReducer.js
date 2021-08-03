import {story, characters} from '../../../utils/mock_data'

// story : [{
//     page: 1,
//     content: ``,
//     choices: [''],
//     branch: ['']
// }]

// characters: {
//     name: '',
//     id: '',
//     hp: 0,
//     atk: 0,
//     def: 0,
//     agi: 0,
//     exp: 0
// }

const init_state = {
    story,
    characters, 
    currentPage: 1,
}

export default (state = init_state, action) => {
    switch(action.type) {
        case 'UPDATE_PAGE':
            return {...state, currentPage: action.payload}
        case 'DECREMENT':
            return state - 1
        default:
            return state
    }
}