import { configureStore } from '@reduxjs/toolkit'
import global_reducer from './global_reducer'

export const store = configureStore({
  reducer: {
    globalStates: global_reducer,
  },
})
