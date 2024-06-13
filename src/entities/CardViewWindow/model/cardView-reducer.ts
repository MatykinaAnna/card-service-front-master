import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiInstance } from 'shared/axios-instance'

export interface cardViewReducerData {
  openСardViewReducer: boolean
}

const loadViewCard = createAsyncThunk(
  'cardViewReducer/loadViewCard',
  async (data: { idCard: number; type_request: number }) => {
    const card = await apiInstance({
      method: 'get',
      url: `/card_result/${data.idCard}/detail/?type_request=${data.type_request}`,
      params: {
        idCard: data.idCard,
        type_request: data.type_request,
      },
    }).then((res) => {
      return res.data
    })

    return card
  }
)

const cardViewReducer = createSlice({
  name: 'cardViewReducer',
  initialState: {
    openСardViewReducer: false,
  } as cardViewReducerData,
  reducers: {
    setOpenСardViewReducer(state, action) {
      state.openСardViewReducer = action.payload
    },
  },
})

export default cardViewReducer.reducer
export const { setOpenСardViewReducer } = cardViewReducer.actions
export { loadViewCard }
