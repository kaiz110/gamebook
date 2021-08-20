

export const UPDATE_PAGE = (page) => ({
    type: 'UPDATE_PAGE',
    payload: page
})

export const LOAD = (book,isNew,currentPage) => ({
    type: 'LOAD',
    payload: {...book, isNew }
})