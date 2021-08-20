import { story, characters, summary } from '../../../utils/mock_data'


const init_state = {
    currentBook : null,
    books: [{
        name: 'Default',
        summary: summary,
        characters: characters,
        story: story,
        error: [],
        bimage: ''
    }]
}

export default (state = init_state, action) => {
    switch (action.type) {
        case 'CURRENT': 
            return {
                currentBook: action.payload,
                books: state.books
            }
        case 'ADD_PROJECT':
            return {
                ...state,
                books: [...state.books , {
                    name: action.payload.name,
                    summary: action.payload.summary,
                    characters: [],
                    story: [],
                    error: [],
                    bimage: ''
                }]
            }
        case 'ADD_BG_IMAGE':
            return {...state, books: state.books.map(val => {
                if(val.name === state.currentBook) {
                    return {...val, bimage: action.payload} // base64
                } else return val
            })}
        case 'ADD_PAGE':
            const obj = {
                page: action.payload.page,
                content: action.payload.content,
                choices: action.payload.choices,
                branch: action.payload.branch,
                image: action.payload.image
            }

            const books = state.books.map(val => {
                if(val.name === state.currentBook) {
                    let sty
                    if(action.payload.edit) {
                        sty = val.story.map(value => {
                            if(value.page === action.payload.page) return obj
                            else return value
                        })
                    } else {
                        sty = [...val.story, obj]
                    }
                    return { ...val, story: sty }

                } else return val
            })
            return {...state, books}
        case 'ADD_CHAR':
            const book = state.books.map(val => {
                if(val.name === state.currentBook) {
                    return Object.assign({}, val, {characters: [...val.characters, {
                        name: action.payload.name,
                        id: action.payload.id,
                        lvl: +action.payload.lvl,
                        hp: +action.payload.hp,
                        atk: +action.payload.atk,
                        def: +action.payload.def,
                        agi: +action.payload.agi,
                        exp: +action.payload.exp
                    }]})
                }else return val
            })
            return {...state, books: book}
        case 'ADD_ERROR':
            const erbook = state.books.map(val => {
                if(val.name === state.currentBook) {
                    return {...val, error: Array.from( new Set([...val.error, action.payload]) ) }
                } else return val
            })
            return {...state, books: erbook}
        case 'REMOVE_ERROR':
            return {...state, books: state.books.map(val => {
                if(val.name === state.currentBook) {
                    return {...val, error: val.error.filter(value => {
                        return value !== action.payload
                    })}
                } else return val
            })}
        case 'DEL_PAGE': 
            const bookss = state.books.map(val => {
                if(val.name === state.currentBook) {
                    return {...val, story: val.story.filter(value => value !== action.payload)}
                } else return val
            })
            return {...state, books: bookss}
        case 'DEL_SUB_CHAR':
            const charbook = state.books.map(val => {
                if(val.name === state.currentBook) {
                    return {...val, characters: val.characters.filter(val => val !== action.payload)}
                } else return val
            })
            return {...state, books: charbook}
        case 'DEL_PROJECT':
            return {...state, books: state.books.filter(val => val !== action.payload)}
        default:
            return state
    }
}