import { combineReducers } from 'redux'
import playReducer from './playReducer'
import charReducer from './charReducer'
import createReducer from './createReducer'
import shelfReducer from './shelfReducer'

export default combineReducers({
    play: playReducer,
    char: charReducer,
    create: createReducer,
    shelf: shelfReducer
})