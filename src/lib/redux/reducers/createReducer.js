
const init_state = {
    currentBook : null,
    books: [{
        name: 'hoimoi',
        summary: 'ishoimoiandmoimoi',
        characters: [],
        story: []
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
                    story: []
                }]
            }
            
        case 'ADD_PAGE':
            const obj = {
                page: action.payload.page,
                content: action.payload.content,
                choices: action.payload.choices,
                branch: action.payload.branch
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
        default:
            return state
    }
}