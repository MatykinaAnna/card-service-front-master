import { createSlice } from '@reduxjs/toolkit'
import {
  BlockData,
  Block_description_result,
  dropdownOption,
} from 'shared/interfaces'
import {
  loadCard,
  loadCardItems,
  createImage,
  updateBlockDescriptionResult,
  updateBlockData,
  createBlockData,
  deleteBlockData,
  deleteBlockDescriptionResult,
  deleteCardResult,
  loadCardItemLayout,
  createCardResult,
  createBlockDescriptionResult,
  CardResult,
  getCardPatternResult,
} from './thunks'
import { act } from 'react-dom/test-utils'

interface CardState {
  activeCard: ActiveCard
  activeCardItem: number | null
  cardItems: Array<dropdownOption>
  activeRow: number | null
  idBlockData: number | null
  openModalWindowImage: Boolean
  deletedBlockData: number[]
  arrayRequests: BlockDescriptionResultData[]
  isChangedCard: boolean
  loadCardPatternResult: boolean
  outsideCard: boolean
  fulfilledUpdateBlockDescriptionResult: boolean
  fulfilledUpdateBlockData: boolean
  fulfilledCreateBlockData: boolean
  fulfilledDeleteBlockData: boolean
  fulfilledCreateCardResult: boolean
  fulfilledCreateBlockDescriptionResult: boolean
  fulfilledDeleteCardResult: boolean
  savedСard: SavedСard[]
  card_item_pattern: number
}
interface BlockDescriptionResultData {
  block_text: string
  block_description_item: number
  card_result: number | null
  order_num: number
  id: number
}

interface ActiveCard {
  id: number | string | null
  block_description_result: Block_description_result[] | []
  full_name_modality?: string
  service_item?: string
  modality?: string
}

interface SavedСard {
  service_item: string
  is_saved_card: boolean
}

const cardReducer = createSlice({
  name: 'cardReducer',
  initialState: {
    activeCard: { id: null, block_description_result: [] },
    activeCardItem: null,
    cardItems: [],
    activeRow: null,
    idBlockData: null,
    openModalWindowImage: false,
    arrayRequests: [],
    deletedBlockData: [],
    fulfilledUpdateBlockDescriptionResult: false,
    fulfilledUpdateBlockData: false,
    fulfilledCreateBlockData: false,
    fulfilledDeleteBlockData: false,
    fulfilledCreateCardResult: false,
    fulfilledCreateBlockDescriptionResult: false,
    fulfilledDeleteCardResult: false,
    isChangedCard: false,
    outsideCard: false,
    savedСard: [],
    loadCardPatternResult: false,

    card_item_pattern: -1,
  } as CardState,
  reducers: {
    setIsChangedCard(state, action) {
      state.isChangedCard = action.payload
    },
    setActiveCardItem(state, action) {
      state.activeCardItem = action.payload
    },
    setFulfilledUpdateBlockDescriptionResult(state, action) {
      state.fulfilledUpdateBlockDescriptionResult = action.payload
    },
    setFulfilledUpdateBlockData(state, action) {
      state.fulfilledUpdateBlockData = action.payload
    },
    setFulfilledCreateBlockData(state, action) {
      state.fulfilledCreateBlockData = action.payload
    },
    setFulfilledDeleteBlockData(state, action) {
      state.fulfilledDeleteBlockData = action.payload
    },
    setFulfilledCreateCardResult(state, action) {
      state.fulfilledCreateCardResult = action.payload
    },
    setFulfilledCreateBlockDescriptionResult(state, action) {
      state.fulfilledCreateBlockDescriptionResult = action.payload
    },
    setFulfilledDeleteCardResult(state, action) {
      state.fulfilledDeleteCardResult = action.payload
    },
    setEmptyTextForCard(state, action) {
      state.activeCard.block_description_result.forEach((item) => {
        item.block_text = ''
      })
    },

    resetActiveCard(state) {
      state.activeCard = { id: null, block_description_result: [] }
    },
    setNewCard(state) {
      state.activeCard.id = 'new'
    },
    setActiveRow(state, action) {
      if (state.activeRow !== action.payload) {
        state.activeRow = action.payload
      } else {
        //state.activeRow = null  ? нужно ли удалять выделение строки?
      }
    },
    setOpenModalWindowImage(state, action) {
      state.openModalWindowImage = action.payload
    },
    setIdBlockData(state, action) {
      state.idBlockData = action.payload
    },
    setOutsideCard(state, action) {
      state.outsideCard = action.payload
    },
    deleteImage(state, action) {
      let itemBlockDescResult = state.activeCard.block_description_result.find(
        (item) => {
          return item.id === state.activeRow
        }
      )
      let index = itemBlockDescResult?.block_data.findIndex((item) => {
        return item.id === action.payload
      })
      itemBlockDescResult?.block_data.splice(index!, 1)
    },
    setDescriptionChanged(
      state,
      action: { payload: { id: number; value: boolean } }
    ) {
      let index = state.activeCard.block_description_result.findIndex(
        (item) => {
          return item.id === action.payload.id
        }
      )
      if (index > -1) {
        state.activeCard.block_description_result[index].changed =
          action.payload.value
      }
    },
    setBlockText(state, action: { payload: { id: number; value: string } }) {
      let index = state.activeCard.block_description_result.findIndex(
        (item) => {
          return item.id === action.payload.id
        }
      )
      if (index > -1) {
        state.activeCard.block_description_result[index].block_text =
          action.payload.value
      }
    },

    setBlockInsertDataType(
      state,
      action: { payload: { id: number; value: number } }
    ) {
      let index = state.activeCard.block_description_result.findIndex(
        (item) => {
          return item.id === action.payload.id
        }
      )
      if (index > -1) {
        state.activeCard.block_description_result[
          index
        ].block_insert_data_type = action.payload.value
      }
    },

    setSizeOfImg(state, action: { payload: { id: number; value: number } }) {
      let index = state.activeCard.block_description_result.findIndex(
        (item) => {
          return item.id === action.payload.id
        }
      )
      if (index > -1) {
        state.activeCard.block_description_result[index].sizeOfImg =
          action.payload.value
      }
      console.log(state.activeCard.block_description_result[index].sizeOfImg)
    },
    setDeletedBlockData(state, action) {
      state.deletedBlockData.push(action.payload)
    },
    delDeletedBlockData(state, action) {
      state.deletedBlockData = []
    },
    setBlockData(state, action: { payload: BlockData }) {
      let index_blDescRes = state.activeCard.block_description_result.findIndex(
        (item) => {
          return item.id === state.activeRow!
        }
      )
      let index_blockData = -1
      if (index_blDescRes > -1) {
        index_blockData = state.activeCard.block_description_result[
          index_blDescRes
        ]?.block_data.findIndex((item) => {
          return item.order_num === action.payload.order_num
        })
      }
      if (index_blockData > -1 && index_blDescRes > -1) {
        let id =
          state.activeCard.block_description_result[index_blDescRes].block_data[
            index_blockData
          ].id
        let block_data = action.payload.block_data
        let order_num =
          state.activeCard.block_description_result[index_blDescRes].block_data[
            index_blockData
          ].order_num
        let url_block_data = action.payload.url_block_data
        if (
          state.activeCard.block_description_result[index_blDescRes].block_data[
            index_blockData
          ].created
        ) {
          state.activeCard.block_description_result[index_blDescRes].block_data[
            index_blockData
          ] = {
            id: id,
            block_data: block_data,
            order_num: order_num,
            url_block_data: url_block_data,
            created: true,
            update: true,
          }
        } else {
          state.activeCard.block_description_result[index_blDescRes].block_data[
            index_blockData
          ] = { ...action.payload }
        }
      } else if (index_blDescRes > -1) {
        state.activeCard.block_description_result[
          index_blDescRes
        ].block_data.push(action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCard.fulfilled, (state, action) => {
        console.log(action.payload)

        if (
          // ответ: сохраненный шаблон для карточки ГК
          String(action.payload.cardData.company_group) ===
          String(action.payload.company_group)
        ) {
          state.activeCard = action.payload.cardData
          state.activeCardItem = state.cardItems[0].id

          state.activeCard.block_description_result.forEach((item) => {
            item.changed = false
            if (item.block_text === undefined || item.block_text == null) {
              item.block_text = ''
            }
            if (item.block_data.length !== 0) {
              item.block_data.forEach((item) => {
                item.created = true
              })
            }
          })
        } else {
          // ответ: общий шаблон для кароточек (его нельзя редактировать)
          state.activeCard = action.payload.cardData
          state.card_item_pattern = Number(state.activeCard.id)
          state.activeCard.id = -1
        }
      })
      .addCase(loadCard.rejected, (state, action) => {
        state.activeCard = { id: null, block_description_result: [] }
        state.activeCardItem = null
      })
      .addCase(
        loadCardItems.fulfilled,
        (
          state,
          action: {
            payload: {
              id: number
              name_string_id: number
              order_num: number
              modality: number
              string: string
            }[]
          }
        ) => {
          if (action.payload !== undefined) {
            state.cardItems = action.payload.sort(
              (a, b) => a.order_num - b.order_num
            )
            state.activeCardItem = state.cardItems[0].id
          } else {
            state.cardItems = []
          }
        }
      )
      .addCase(loadCardItemLayout.fulfilled, (state, action) => {
        if (action.payload !== null) {
          // @ts-ignore
          state.activeCard.block_description_result = action.payload
          state.activeCard.block_description_result.forEach((item, index) => {
            item['id'] = index
            item['order_num'] = index
            item['sizeOfImg'] = 0
          })
        }
      })

      .addCase(
        createCardResult.fulfilled,
        (state, action: { payload: CardResult }) => {
          if (action.payload.id !== undefined) {
            state.activeCard.id = action.payload.id
            state.activeCard.block_description_result.forEach((item) => {
              item.card_result = action.payload.id!
            })
          }
          console.log('Установить activeCardItem', action.payload)
          state.activeCardItem = action.payload.card_item
          state.fulfilledCreateCardResult = true
        }
      )

      .addCase(deleteCardResult.fulfilled, (state, action) => {
        state.fulfilledDeleteCardResult = true
      })

      .addCase(createImage.fulfilled, (state, action) => {
        let itemBlockDescResult =
          state.activeCard.block_description_result.find((item) => {
            return item.id === state.activeRow
          })
        itemBlockDescResult?.block_data.push(action.payload)
        state.idBlockData = action.payload.id
      })
      .addCase(updateBlockDescriptionResult.fulfilled, (state, action) => {
        state.fulfilledUpdateBlockDescriptionResult = true
      })
      .addCase(updateBlockDescriptionResult.rejected, (state, action) => {})

      .addCase(updateBlockData.fulfilled, (state, action) => {
        state.fulfilledUpdateBlockData = true
      })
      .addCase(updateBlockData.rejected, (state, action) => {})

      .addCase(createBlockData.fulfilled, (state, action) => {
        if (action.payload.length !== 0) {
          console.log('createBlockData', action.payload)
          console.log(
            'createBlockData',
            state.activeCard.block_description_result
          )

          action.payload.forEach((block_data) => {
            let index = state.activeCard.block_description_result.findIndex(
              (item) => {
                //@ts-ignore
                return item.id === block_data.block_description_result
              }
            )
            let index1 = state.activeCard.block_description_result[
              index
            ].block_data.findIndex((item) => {
              //@ts-ignore
              return item.order_num === block_data.order_num
            })

            state.activeCard.block_description_result[index].block_data[
              index1
              //@ts-ignore
            ].id = block_data.id
            state.activeCard.block_description_result[index].block_data[
              index1
            ].created = true
          })
        }
      })
      .addCase(createBlockData.rejected, (state, action) => {})

      .addCase(createBlockDescriptionResult.fulfilled, (state, action) => {
        action.payload.forEach((blockDescRes) => {
          // @ts-ignore
          let order_num = blockDescRes.order_num
          let index = state.activeCard.block_description_result.findIndex(
            (item) => {
              return item.order_num === order_num - 1
            }
          )

          state.activeCard.block_description_result[index].id =
            // @ts-ignore
            blockDescRes.id
        })

        state.fulfilledCreateBlockDescriptionResult = true
      })
      .addCase(createBlockDescriptionResult.rejected, (state, action) => {})

      .addCase(deleteBlockData.fulfilled, (state, action) => {
        state.fulfilledDeleteBlockData = true
      })
      .addCase(deleteBlockData.rejected, (state, action) => {})
      .addCase(getCardPatternResult.fulfilled, (state, action) => {
        if (action.payload === null) {
          console.log('не внесен шаблон карточки')
        } else {
          state.loadCardPatternResult = true
          action.payload['block_description_result'].forEach(
            (item: Block_description_result) => {
              item.id = item.order_num - 1
              item.order_num = item.order_num - 1
              item.card_result = null
            }
          )

          state.activeCard.block_description_result =
            action.payload.block_description_result
        }
      })
  },
})

export default cardReducer.reducer
export const {
  setActiveRow,
  setOpenModalWindowImage,
  setIdBlockData,
  setBlockText,
  setSizeOfImg,
  setDescriptionChanged,
  setBlockData,
  setDeletedBlockData,
  deleteImage,
  setActiveCardItem,
  resetActiveCard,
  setNewCard,
  setOutsideCard,
  delDeletedBlockData,
  setBlockInsertDataType,

  setFulfilledUpdateBlockDescriptionResult,
  setFulfilledUpdateBlockData,
  setFulfilledCreateBlockData,
  setFulfilledDeleteBlockData,
  setFulfilledCreateCardResult,
  setFulfilledCreateBlockDescriptionResult,
  setFulfilledDeleteCardResult,
  setIsChangedCard,
  setEmptyTextForCard,
} = cardReducer.actions
export {
  loadCard,
  createImage,
  updateBlockDescriptionResult,
  updateBlockData,
  createBlockData,
  deleteBlockData,
  deleteBlockDescriptionResult,
  deleteCardResult,
  createBlockDescriptionResult,
  getCardPatternResult,
}
