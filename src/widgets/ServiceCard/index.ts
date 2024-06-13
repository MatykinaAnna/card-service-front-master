import { ServiceCard } from './ui/ServiceCard';
import cardReducer from './model/card-reducer';
import { setActiveRow } from './model/card-reducer';
import {
  setIdBlockData,
  setBlockText,
  setDescriptionChanged,
  setFulfilledUpdateBlockDescriptionResult,
  setFulfilledUpdateBlockData,
  setFulfilledCreateBlockData,
  setFulfilledDeleteBlockData,
  setFulfilledCreateCardResult,
  setFulfilledCreateBlockDescriptionResult,
  setFulfilledDeleteCardResult,
  setEmptyTextForCard,
  getCardPatternResult,
  delDeletedBlockData,
} from './model/card-reducer';
import { setOpenСardViewReducer } from 'entities/CardViewWindow/model/cardView-reducer';
import { setOpenConfirmReducer } from 'features/ConfirmWindow';
export {
  ServiceCard,
  cardReducer,
  setActiveRow,
  setIdBlockData,
  setBlockText,
  setDescriptionChanged,
  setFulfilledUpdateBlockDescriptionResult,
  setFulfilledUpdateBlockData,
  setFulfilledCreateBlockData,
  setFulfilledDeleteBlockData,
  setFulfilledCreateCardResult,
  setFulfilledCreateBlockDescriptionResult,
  setFulfilledDeleteCardResult,
  setOpenСardViewReducer,
  getCardPatternResult,
  setOpenConfirmReducer,
  setEmptyTextForCard,
  delDeletedBlockData,
};
