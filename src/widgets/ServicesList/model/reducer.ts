import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stat } from 'fs';
import { apiInstance } from 'shared/axios-instance';

interface Services {
  mod: number;
  lang: number;
  company_group: string | null;
}

const asyncLoadServices = createAsyncThunk(
  'serviceReducer/asyncLoadServices',
  async (data: Services) => {
    if (data.company_group !== 'null') {
      const services = await apiInstance
        .get(
          //при загрузке сервиса data.mod для "МРТ", пользователь выбирает другую modality при необходимости
          `/service_item/?modality=${data.mod}&language=${data.lang}&company_group=${data.company_group}`
        )
        .then((res) => {
          return res.data;
        });
      return services;
    } else {
      const services = await apiInstance
        .get(
          //при загрузке сервиса data.mod для "МРТ", пользователь выбирает другую modality при необходимости
          `/service_item/?modality=${data.mod}&language=${data.lang}`
        )
        .then((res) => {
          return res.data;
        });
      return services;
    }
  }
);

const asyncLoadModality = createAsyncThunk(
  'serviceReducer/asyncLoadModality',
  async () => {
    const modality = await apiInstance
      .get(`/modality/`)
      .then((res) => res.data);

    return modality;
  }
);

const serviceReducer = createSlice({
  name: 'serviceReducer',
  initialState: {
    activeModality: -1,
    activeService: null,
    serviceId: null,
    clickOnService: null,
    services: [],
    modalities: [],
    loadServicesFulfilled: false,
  },
  reducers: {
    setActiveModality(state, action) {
      state.activeModality = action.payload;
    },
    setActiveService(state, action) {
      state.activeService = action.payload;
    },
    setServiceId(state, action) {
      console.log('setServiceId', action.payload);
      state.serviceId = action.payload;
    },
    setClickOnService(state, action) {
      state.clickOnService = action.payload;
    },
    setServiceCard(state, action: { payload: boolean }) {
      try {
        state.services.find((item: { id: number }) => {
          return item.id === state.activeService;
          //@ts-ignore
        })!.savedCard = action.payload;
      } catch {
        console.log('ERROR  setServiceCard');
      }
    },
    setLoadServicesFulfilled(state, action: { payload: boolean }) {
      state.loadServicesFulfilled = action.payload;
    },
    setServiceSaveCard(
      state,
      action: { payload: { idServ: number; value: number } }
    ) {
      state.services.find((item: { id: number; card_result: number }) => {
        return item.id === action.payload.idServ;
        //@ts-ignore
      })!.card_result = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncLoadModality.fulfilled, (state, action) => {
        state.modalities = action.payload.sort((a: any, b: any) => {
          return a.order_num - b.order_num;
        });

        let m: never[] = [];
        for (let i = 0; i < state.modalities.length; i++) {
          //@ts-ignore
          if (state.modalities[i].id !== 7) {
            m.push(state.modalities[i]);
          }
        }
        //@ts-ignore
        state.modalities = m;
      })
      .addCase(asyncLoadServices.fulfilled, (state, action) => {
        state.services = [];
        //@ts-ignore
        action.payload.forEach((item) => {});
        //@ts-ignore
        let services = action.payload
          .sort((a: any, b: any) => {
            if (a.price_group !== null && b.price_group !== null) {
              if (a.price_group.order_num !== b.price_group.order_num) {
                return a.price_group.order_num - b.price_group.order_num;
              } else {
                return a.order_in_group - b.order_in_group;
              }
            } else {
              return a.order_in_group - b.order_in_group;
            }
          })
          .map((item: { id: number; service_item_link: [] }) => {
            return { ...item, takenOut: false }; // указание на то, что элемент еще не прошел сортировку
          });

        let other:
          | {
              service_item_type: number;
              service_item_link: [];
              service: { string: string };
            }
          | undefined = undefined;

        //@ts-ignore
        services.forEach(
          (element: {
            service_item_type: number;
            service_item_link: [];
            service: { string: string };
            is_enabled: number;
          }) => {
            if (element.service_item_type === 1) {
              if (element.service.string !== 'Прочее') {
                if (element.is_enabled === 1) {
                  //@ts-ignore
                  state.services.push(element);
                }
              } else {
                other = element;
              }

              element.service_item_link.forEach(
                (item: {
                  service_item_type: number;
                  service_item_link: number;
                }) => {
                  let childService = services.find((item1: { id: number }) => {
                    return item1.id === item.service_item_link;
                  });
                  console.log(childService, element);
                  if (
                    childService.service_item_type === 2 ||
                    // childService.service_item_type === 3 ||
                    childService.service_item_type === 5
                  ) {
                    if (childService.is_enabled === 1) {
                      //@ts-ignore
                      state.services.push(childService);
                    }
                  }
                }
              );
            }
          }
        );
        if (other !== undefined) {
          state.services.push(other);
        }

        //state.services = services

        state.loadServicesFulfilled = true;
      });
  },
});

export default serviceReducer.reducer;
export const {
  setActiveModality,
  setActiveService,
  setServiceCard,
  setLoadServicesFulfilled,
  setServiceSaveCard,
  setClickOnService,
  setServiceId,
} = serviceReducer.actions;
export { asyncLoadServices, asyncLoadModality };
