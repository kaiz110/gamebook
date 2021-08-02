

export const CHAR_CREATE = (name) => ({
    type: 'CHAR_CREATE',
    payload: name
})

export const CHAR_LEVEL_UP = (enemyExp) => ({
    type: 'CHAR_LEVEL_UP',
    payload: enemyExp
})

export const CHAR_ATRB = (which) => ({
    type: 'CHAR_ATRB',
    payload: which
})

export const CHAR_DEL = () => ({
    type: 'CHAR_DEL'
})