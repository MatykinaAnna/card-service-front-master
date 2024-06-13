import serviceReducer from './model/reducer'
import {
  setActiveModality,
  setActiveService,
  setServiceCard,
  setLoadServicesFulfilled,
  setServiceSaveCard,
  setClickOnService,
  setServiceId,
} from './model/reducer'
import { setOpenConfirmReducer } from 'features/ConfirmWindow/model/confirm-reducer'
import { ServicesList } from './ui/ServicesList'
import {
  updateBlockDescriptionResult,
  updateBlockData,
  createBlockData,
  setDeletedBlockData,
  deleteBlockData,
  deleteBlockDescriptionResult,
  deleteCardResult,
  createBlockDescriptionResult,
  getCardPatternResult,
} from 'widgets/ServiceCard/model/card-reducer'
import { createCardResult } from 'widgets/ServiceCard/model/thunks'
import { setResult } from 'features/ConfirmWindow/model/confirm-reducer'
import { setBtn } from 'features/ConfirmWindow/model/confirm-reducer'
import { setDescriptionChanged } from 'widgets/ServiceCard/model/card-reducer'
import { Loader } from 'features/Loader'

export {
  setActiveModality,
  setActiveService,
  ServicesList,
  serviceReducer,
  updateBlockDescriptionResult,
  updateBlockData,
  createBlockData,
  setDeletedBlockData,
  deleteBlockData,
  deleteBlockDescriptionResult,
  deleteCardResult,
  setResult,
  setBtn,
  createCardResult,
  createBlockDescriptionResult,
  setServiceCard,
  setDescriptionChanged,
  getCardPatternResult,
  setLoadServicesFulfilled,
  setServiceSaveCard,
  Loader,
  setOpenConfirmReducer,
  setClickOnService,
  setServiceId,
}
