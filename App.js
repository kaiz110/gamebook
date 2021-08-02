import 'react-native-gesture-handler'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducer from './src/lib/redux/reducers'
import Route from './src/navigation'

const reduxStore = createStore(reducer)

export default () => 
(
  <Provider store={reduxStore}>
    <Route/>
  </Provider>
)


