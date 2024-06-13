import { apiInstance } from 'shared/axios-instance'
import { createAsyncThunk } from '@reduxjs/toolkit'
import {
  BlockData,
  DescItem,
  Block_description_result,
} from 'shared/interfaces'

interface DataForCard {
  serv: number
  lang: number
  company_group: string | null
  card_item: number
}
interface Data {
  data: FormData
  language: number
}
interface BlockDescriptionResultData {
  block_text: string
  block_description_item: number
  card_result: number | null
  id: number
  block_insert_data_type: number | null
}
export interface CardResult {
  language: number
  service_item: number | null
  company_group: string | null
  card_item: number | null
  id?: number
  modality?: string
  block_description_result?: BlockDescriptionResultData[] | []
  order_num?: number

  card_item_pattern?: number
}

const loadCard = createAsyncThunk(
  'cardReducer/loadCard',
  async (data: DataForCard) => {
    if (data.company_group !== 'null') {
      console.log('data.company_group', data.company_group)
      const card = await apiInstance({
        method: 'get',
        url: `/card_result/detail/?type_request=2`,
        params: {
          service_item: data.serv,
          company_group: data.company_group,
          language: data.lang,
        },
      }).then((res) => {
        return res.data
      })

      return { cardData: card, company_group: data.company_group }
    } else {
      console.log('data.company_group', data.company_group)
      const card = await apiInstance({
        method: 'get',
        url: `/card_result/detail/?type_request=2`,
        params: {
          service_item: data.serv,
          company_group: null,
          language: data.lang,
        },
      }).then((res) => res.data)

      return { cardData: card, company_group: null }
    }
  }
)

// загрузка карточки либо шаблона при переключении шаблона
const loadCardItemLayout = createAsyncThunk(
  'cardReducer/loadCardItemLayout',
  async (data: number) => {
    const blockDescriptionItems: Array<DescItem> | [] = await apiInstance({
      method: 'get',
      url: `/block_description_item/`,
      params: {
        card_item: data,
      },
    }).then((res) => res.data)

    let resultLayout = {
      block_text: '',
      block_data: [],
      block_description_item: {},
      card_result: null,
    }

    let result = blockDescriptionItems.map((el) => {
      return { ...resultLayout, block_description_item: el }
    })

    return result
  }
)

const createCardResult = createAsyncThunk(
  'cardReducer/createCardResult',
  async (data: CardResult) => {
    let data1
    if (data.company_group !== 'null') {
      data1 = {
        ...data,
        company_group: Number(data.company_group),
      }
    } else {
      data1 = {
        ...data,
        company_group: null,
      }
    }

    const Result: CardResult = await apiInstance({
      method: 'post',
      url: `/card_result/create/`,
      data: data1,
    }).then((res) => {
      return { ...res.data, serviceId: Number(data.service_item) }
    })
    return Result
  }
)

const getCardPatternResult = createAsyncThunk(
  'cardReducer/getCardPatternResult',
  async (data: { serv: number; lang: number }) => {
    // const services = await apiInstance
    //   .get(`/card_result/?company_group__isnull=true`)
    //   .then((res) => {
    //     return res.data;
    //   });
    // return services;

    const card = await apiInstance({
      method: 'get',
      url: `/card_result/`,
      params: {
        service_item: data.serv,
        language: data.lang,
      },
    }).then((res) => res.data)

    if (card.length > 0) {
      return card[0]
    } else {
      return null
    }
  }
)

const deleteCardResult = createAsyncThunk(
  'cardReducer/deleteCardResult',
  async (data: number) => {
    const Result: CardResult = await apiInstance({
      method: 'delete',
      url: `/card_result/${data}/deleted/`,
      data: data,
    }).then((res) => res.data)
    return Result
  }
)

const createImage = createAsyncThunk(
  'imageReducer/createImage',
  async (data: Data) => {
    const newImag: BlockData = await apiInstance({
      method: 'post',
      url: `/block_data/create/?language=${data.language}`,
      data: data.data,
    }).then((res) => res.data)
    return newImag
  }
)

const deleteBlockDescriptionResult = createAsyncThunk(
  'cardReducer/deleteArrayBlockDescriptionResult',
  async (data: number[]) => {
    const arrayRequests = data.map((item) => {
      return apiInstance({
        method: 'delete',
        url: `/block_description_result/${item}/deleted/`,
        data: item,
      })
    })
    const updateArrayRequests = await Promise.all(arrayRequests).then(
      (response) => {
        arrayRequests.forEach((item, index) => {
          item.then((resp) => {
            response[index] = resp.data
          })
        })
        return response
      }
    )
    return updateArrayRequests
  }
)

const updateBlockDescriptionResult = createAsyncThunk(
  'cardReducer/updateArrayBlockDescriptionResult',
  async (data: BlockDescriptionResultData[]) => {
    const arrayRequests = data.map((item) => {
      return apiInstance({
        method: 'put',
        url: `/block_description_result/${item.id}/update/`,
        data: item,
      })
    })
    const updateArrayRequests = await Promise.all(arrayRequests).then(
      (response) => {
        arrayRequests.forEach((item, index) => {
          item.then((resp) => {
            response[index] = resp.data
          })
        })
        return response
      }
    )
    return updateArrayRequests
  }
)

const createBlockData = createAsyncThunk(
  'cardReducer/createBlockData',
  async (
    data: {
      order_num: number
      block_data: string
      block_description_result: number
    }[]
  ) => {
    const arrayRequests = data.map((item) => {
      return apiInstance({
        method: 'post',
        url: `/block_data/create/`,
        data: {
          block_data: item.block_data,
          order_num: item.order_num,
          block_description_result: item.block_description_result,
        },
      })
    })

    const createArrayRequests = await Promise.all(arrayRequests).then(
      (response) => {
        arrayRequests.forEach((item, index) => {
          item.then((resp) => {
            response[index] = resp.data
          })
        })
        return response
      }
    )
    return createArrayRequests
  }
)

const createBlockDescriptionResult = createAsyncThunk(
  'cardReducer/createBlockDescriptionResult',
  async (
    data: {
      block_text: string
      block_description_item: number
      card_result: number | null
      block_insert_data_type: number | null
    }[]
  ) => {
    const arrayRequests = data.map((item) => {
      return apiInstance({
        method: 'post',
        url: `/block_description_result/create/`,
        data: {
          block_text: item.block_text,
          block_description_item: item.block_description_item,
          card_result: item.card_result,
          block_insert_data_type: item.block_insert_data_type,
        },
      })
    })
    const createArrayRequests = await Promise.all(arrayRequests).then(
      (response) => {
        arrayRequests.forEach((item, index) => {
          item.then((resp) => {
            response[index] = resp.data
          })
        })
        return response
      }
    )
    return createArrayRequests
  }
)

const deleteBlockData = createAsyncThunk(
  'cardReducer/deleteBlockData',
  async (data: number[]) => {
    const arrayRequests = data.map((item) => {
      return apiInstance({
        method: 'delete',
        url: `/block_data/${item}/deleted/`,
      })
    })

    const createArrayRequests = await Promise.all(arrayRequests).then(
      (response) => {
        arrayRequests.forEach((item, index) => {
          item.then((resp) => {
            response[index] = resp.data
          })
        })
        return response
      }
    )
    return createArrayRequests
  }
)

const updateBlockData = createAsyncThunk(
  'cardReducer/updateBlockData',
  async (
    data: {
      order_num: number
      block_data: string
      block_description_result: number
      id: number
    }[]
  ) => {
    const arrayRequests = data.map((item) => {
      return apiInstance({
        method: 'put',
        url: `/block_data/${item.id}/update/`,
        data: {
          block_data: item.block_data,
          order_num: item.order_num,
          block_description_result: item.block_description_result,
        },
      })
    })
    const updateArrayRequests = await Promise.all(arrayRequests).then(
      (response) => {
        arrayRequests.forEach((item, index) => {
          item.then((resp) => {
            response[index] = resp.data
          })
        })
        return response
      }
    )
    return updateArrayRequests
  }
)

const loadCardItems = createAsyncThunk(
  'cardReducer/loadCardItems',
  async (data: number) => {
    //@ts-ignore
    let result = []

    //массив шаблонов по умолчанию для выбранной modality
    const items = await apiInstance({
      method: 'get',
      url: `/card_item/`,
      params: {
        modality: data,
      },
    }).then((res) => {
      if (res.data.length !== 0) {
        return res.data
      }
    })

    console.log('по умолчанию:', items)

    return items
  }
)

export {
  loadCard,
  loadCardItems,
  createImage,
  updateBlockDescriptionResult,
  updateBlockData,
  createBlockData,
  deleteBlockData,
  deleteBlockDescriptionResult,
  deleteCardResult,
  createBlockDescriptionResult,
  loadCardItemLayout,
  createCardResult,
  getCardPatternResult,
}
