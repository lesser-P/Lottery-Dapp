import { createSlice } from '@reduxjs/toolkit'
import { global_actions } from './actions/global_action'
import { global_states } from './states/global_states'

export const globalSlices = createSlice({
  name: 'global',
  initialState: global_states,
  reducers: global_actions,
})

export const globalActions = globalSlices.actions
export default globalSlices.reducer
