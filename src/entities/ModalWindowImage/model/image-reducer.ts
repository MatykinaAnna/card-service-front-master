import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { cardReducer } from 'features/UploadImage'

const imageReducer = createSlice({
  name: 'imageReducer',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {},
})
export default imageReducer.reducer
