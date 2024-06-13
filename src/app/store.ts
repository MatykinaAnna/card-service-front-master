import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { serviceReducer } from 'widgets/ServicesList'
import { langReducer } from 'features/ChangeLang'
import { cardReducer } from 'widgets/ServiceCard'
import { imageReducer } from 'entities/ModalWindowImage'
import { confirmReducer } from 'features/ConfirmWindow'
import { UploadImageReducer } from 'features/UploadImage'
import { cardViewReducer } from 'entities/CardViewWindow'

export const rootReducer = combineReducers({
  serviceReducer: serviceReducer,
  langReducer: langReducer,
  cardReducer: cardReducer,
  imageReducer: imageReducer,
  confirmReducer: confirmReducer,
  UploadImageReducer: UploadImageReducer,
  cardViewReducer: cardViewReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
