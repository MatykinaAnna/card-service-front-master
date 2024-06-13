import { createSlice } from '@reduxjs/toolkit'

const langReducer = createSlice({
  name: 'langReducer',
  initialState: {
    activeLang: 1,
    langList: ['ru', 'en', 'fr'],
  },
  reducers: {
    setActiveLang(state, action) {
      state.activeLang = action.payload
    },
  },
})

export default langReducer.reducer
export const { setActiveLang } = langReducer.actions
