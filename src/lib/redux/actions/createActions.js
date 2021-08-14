

export const CURRENT = (book) => ({
    type: 'CURRENT',
    payload: book
})

export const ADD_PROJECT = (nameAndSum) => ({
    type: 'ADD_PROJECT',
    payload: nameAndSum
})

export const DEL_PROJECT = (book) => ({
    type: 'DEL_PROJECT',
    payload: book
})

export const ADD_PAGE = (edit, page, content, choices, branch) => ({
    type: 'ADD_PAGE',
    payload: { edit, page, content, choices, branch }
})

export const DEL_PAGE = (page) => ({
    type: 'DEL_PAGE',
    payload: page
})

export const ADD_CHAR = (name, id, lvl, hp , atk, def, agi, exp) => ({
    type: 'ADD_CHAR',
    payload: {name, id, lvl, hp , atk, def, agi, exp}
})

export const DEL_SUB_CHAR = (char) => ({
    type: 'DEL_SUB_CHAR',
    payload: char
})

export const ADD_ERROR = (page) => ({
    type: 'ADD_ERROR',
    payload: page
})

export const REMOVE_ERROR = (page) => ({
    type: 'REMOVE_ERROR',
    payload: page
})


