import { combineReducers } from 'redux'
import playReducer from './playReducer'
import charReducer from './charReducer'

export default combineReducers({
    play: playReducer,
    char: charReducer
})