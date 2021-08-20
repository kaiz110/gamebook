

export const PUT_ON = (book) => ({
    type: 'PUT_ON',
    payload: book
})

export const DUMP = (bookName) => ({
    type: 'DUMP',
    payload: bookName
})

export const BOOKMARK = (name, page) => ({
    type: 'BOOKMARK',
    payload: {name, page}
})