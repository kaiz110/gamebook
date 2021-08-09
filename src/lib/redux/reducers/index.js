import { combineReducers } from 'redux'
import playReducer from './playReducer'
import charReducer from './charReducer'
import createReducer from './createReducer'

export default combineReducers({
    play: playReducer,
    char: charReducer,
    create: createReducer
})