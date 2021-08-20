import 'react-native-gesture-handler'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { persistStore, persistReducer } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import reducer from './src/lib/redux/reducers'
import Route from './src/navigation'
import AsyncStorage from '@react-native-async-storage/async-storage'

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)

export default () => 
(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Route/>
    </PersistGate>
  </Provider>
)


