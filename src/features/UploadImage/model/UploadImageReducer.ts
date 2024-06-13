import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
const uploadImageReducer = createSlice({
  name: 'uploadImageReducer',
  initialState: {
    order_num: -1,
  },
  reducers: {
    setOrderNum(state, action) {
      state.order_num = action.payload
    },
  },
})
export default uploadImageReducer.reducer
export const { setOrderNum } = uploadImageReducer.actions
export {}
