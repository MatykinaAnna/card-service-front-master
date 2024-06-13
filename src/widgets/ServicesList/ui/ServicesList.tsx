import '@mc/numedy-ui-kit/dist/esm/index.css';
import styles from './ServicesList.module.scss';
import classNames from 'classnames';
import { useParams, useSearchParams } from 'react-router-dom';
import { save, nosave } from 'shared/icons/_index';
import { useEffect, useState } from 'react';
import {
  asyncLoadServices,
  asyncLoadModality,
  setActiveModality,
  setActiveService,
} from '../model/reducer';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { Dropdown } from '@mc/numedy-ui-kit';
import { ChangeLang } from 'features/ChangeLang';
import { ConfirmWindow } from '../../../features/ConfirmWindow';
import {
  loadCard,
  resetActiveCard,
  setActiveCardItem,
  setIsChangedCard,
  setNewCard,
} from 'widgets/ServiceCard/model/card-reducer';
import {
  updateBlockDescriptionResult,
  updateBlockData,
  createBlockData,
  deleteBlockData,
  deleteCardResult,
  deleteBlockDescriptionResult,
  setResult,
  createBlockDescriptionResult,
  setServiceCard,
  setLoadServicesFulfilled,
  Loader,
  setServiceId,
} from '../index';
import { dropdownOption } from 'shared/interfaces';
import { ButtonWithIcon } from 'features/ButtonWithIcon';
import { add, del, noadd, nodel } from 'shared/icons/_index';
import { Modalities_CardService } from 'shared/interfaces';
import { createCardResult, setServiceSaveCard } from '../index';
import { setBtn } from '../../../features/ConfirmWindow';

import { greenCheck } from 'shared/icons/_index';

interface Data {
  block_text: string;
  block_description_item: number;
  card_result: number | null;
  id: number;
  block_insert_data_type: number | null;
}

export const ServicesList = () => {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  const activeService = useAppSelector(
    //id выбранного серсвиса
    (state) => state.serviceReducer.activeService
  );
  const activeModality = useAppSelector(
    (state) => state.serviceReducer.activeModality
  );
  const activeLang = useAppSelector((state) => state.langReducer.activeLang);
  const activeCard = useAppSelector((state) => state.cardReducer.activeCard);
  const services = useAppSelector((state) => state.serviceReducer.services);
  const modalities: Modalities_CardService[] = useAppSelector(
    (state) => state.serviceReducer.modalities
  );
  const cardItems = useAppSelector((state) => state.cardReducer.cardItems);
  const result = useAppSelector((state) => state.confirmReducer.result);
  const fulfilledCreateCardResult = useAppSelector(
    (state) => state.cardReducer.fulfilledCreateCardResult
  );
  const fulfilledDeleteCardResult = useAppSelector(
    (state) => state.cardReducer.fulfilledDeleteCardResult
  );
  const fulfilledCreateBlockDescriptionResult = useAppSelector(
    (state) => state.cardReducer.fulfilledCreateBlockDescriptionResult
  );
  const deletedBlockData = useAppSelector(
    (state) => state.cardReducer.deletedBlockData
  );
  const loadServicesFulfilled = useAppSelector(
    (state) => state.serviceReducer.loadServicesFulfilled
  );

  const serviceId = useAppSelector((state) => state.serviceReducer.serviceId);

  const setActiveOption = (option: dropdownOption) => {
    dispatch(setActiveModality(option.id));
    dispatch(resetActiveCard());
  };

  const isChangedCard = useAppSelector(
    (state) => state.cardReducer.isChangedCard
  );

  const [props, setProps] = useState({
    text: '',
    onTrickClick: (clickBtn: string) => {},
  });
  const [isConfirm, setIsConfirm] = useState(false);
  let resultConfirm = '1';

  const selectService = async (
    serviceId: number,
    card_item: number,
    is_enabled: number
  ) => {
    if (is_enabled === 1) {
      if (serviceId === activeService) {
        dispatch(setActiveService(null));
        dispatch(resetActiveCard());
      } else {
        if (!isChangedCard) {
          if (serviceId !== null && activeLang !== null) {
            dispatch(setActiveService(serviceId));
            if (cardItems[0] !== undefined) {
              dispatch(setActiveCardItem(cardItems[0].id));
            }

            dispatch(
              loadCard({
                serv: serviceId,
                lang: activeLang,
                company_group: searchParams.get('company_group'),
                card_item: card_item,
              })
            );
          } else {
            console.error(
              'CARD DONT LOADED',
              activeService,
              activeLang,
              cardItems.length
            );
          }
        } else {
          dispatch(setServiceId(serviceId));
          let card_item = services.find((item: { id: number }) => {
            return item.id === serviceId;
          });
          await saveCard(serviceId, card_item);
        }
      }
    }
  };

  useEffect(() => {
    dispatch(asyncLoadModality());
  }, []);

  useEffect(() => {
    if (modalities[0] !== undefined) {
      dispatch(setActiveModality(modalities[0].id));
    }
  }, [modalities]);

  useEffect(() => {
    dispatch(setLoadServicesFulfilled(false));
    dispatch(setIsChangedCard(false));
    if (activeModality !== null && activeModality > -1) {
      dispatch(
        asyncLoadServices({
          mod: activeModality,
          lang: activeLang,
          company_group: searchParams.get('company_group'),
        })
      );
    }
  }, [activeModality, activeLang]);

  function getDataInformation(flagNew: boolean) {
    console.log('getDataInformation');

    let arrayDataUpdate: {
      order_num: number;
      block_data: string;
      block_description_result: number;
      id: number;
      block_insert_data_type: number | null;
    }[] = [];
    let arrayDataCreate: {
      order_num: number;
      block_data: string;
      block_description_result: number;
      block_insert_data_type: number | null;
    }[] = [];
    activeCard.block_description_result.forEach((item) => {
      console.log(item);

      if (item.changed) {
        item.block_data.forEach((item_blD) => {
          if (item_blD.created && item_blD.update) {
            arrayDataUpdate.push({
              order_num: item_blD.order_num,
              block_data: item_blD.block_data,
              block_description_result: item.id,
              id: item_blD.id,
              block_insert_data_type: item.block_insert_data_type,
            });
          } else if (
            item_blD.created === undefined &&
            item_blD.update === undefined
          ) {
            arrayDataCreate.push({
              order_num: item_blD.order_num,
              block_data: item_blD.block_data,
              block_description_result: item.id,
              block_insert_data_type: item.block_insert_data_type,
            });
          }
        });
      }
    });

    return {
      arrayDataCreate: arrayDataCreate,
      arrayDataUpdate: arrayDataUpdate,
    };
  }

  function getDescription(flagNew: boolean) {
    let arrayDescription: Data[] = [];
    activeCard.block_description_result.forEach((item) => {
      if (item.changed || flagNew) {
        let data = {
          block_text: item.block_text,
          block_description_item: item.block_description_item.id,
          card_result: item.card_result,
          id: item.id,
          block_insert_data_type: item.block_insert_data_type,
        };
        arrayDescription.push(data);
      }
    });

    return {
      arrayDescription: arrayDescription,
    };
  }

  useEffect(() => {
    if (fulfilledCreateCardResult) {
      let arrayDescription = getDescription(true).arrayDescription;

      let newArrayDescription = arrayDescription.map((item) => {
        return {
          block_text: item.block_text,
          block_description_item: item.block_description_item,
          card_result: Number(activeCard.id),
          id: item.id,
          block_insert_data_type: item.block_insert_data_type,
        };
      });
      //@ts-ignore
      dispatch(setServiceCard(true));

      //2 шаг
      console.log('2 шаг');
      dispatch(createBlockDescriptionResult(newArrayDescription));
    }
  }, [fulfilledCreateCardResult, dispatch]);

  useEffect(() => {
    if (fulfilledDeleteCardResult) {
      //@ts-ignore
      dispatch(setServiceCard(false));
    }
  }, [fulfilledDeleteCardResult]);

  useEffect(() => {
    if (fulfilledCreateBlockDescriptionResult) {
      console.log('3 шаг');
      // 3 шаг

      dispatch(createBlockData(getDataInformation(true).arrayDataCreate));

      //сброс флагов для модального окна
      dispatch(setResult(false));
      dispatch(setBtn(0));

      console.log('3 шаг', serviceId);
      //установка галочки
      dispatch(setServiceSaveCard({ idServ: Number(activeService), value: 1 }));
      if (serviceId !== null) {
      }
    }
  }, [fulfilledCreateBlockDescriptionResult]);

  function deleteCardForServer() {
    dispatch(resetActiveCard());
    let deleteBlockDataId: number[] = [];
    let deleteBlockDescriptionResultId: number[] = [];
    let deleteCardResultId: number;
    deleteCardResultId = Number(activeCard.id);
    activeCard.block_description_result.forEach((item) => {
      deleteBlockDescriptionResultId.push(Number(item.id));
      item.block_data.forEach((img) => {
        deleteBlockDataId.push(Number(img.id));
      });
    });
    dispatch(deleteCardResult(deleteCardResultId));
    dispatch(deleteBlockDescriptionResult(deleteBlockDescriptionResultId));
    dispatch(deleteBlockData(deleteBlockDataId));

    //удаление галочки
    dispatch(setServiceSaveCard({ idServ: Number(activeService), value: 0 }));
  }

  async function deleteCard() {
    setIsConfirm(true);
    while (true) {
      await waitForChange('Удалить карточку?'); // Wait until targetObj.x has been changed.
      if (resultConfirm === 'btn_close') {
        setIsConfirm(false);
      } else if (resultConfirm === 'btn-true') {
        dispatch(setIsChangedCard(false));
        deleteCardForServer();
        setIsConfirm(false);
      } else if (resultConfirm === 'btn-false') {
        dispatch(setIsChangedCard(false));
        setIsConfirm(false);
      }
      await new Promise((resolve) => setTimeout(resolve, 0)); // Making the dialog to show properly. You will not need this line in your code.
    }
  }

  function waitForChange(text: string) {
    return new Promise<void>((resolve) => {
      setProps({
        text: text,

        onTrickClick: function (clickBtn: string) {
          resultConfirm = clickBtn;
          resolve();
        },
      });
    });
  }

  function firstStepForSave() {
    //карточка уже создана, редактирование карточки
    if (activeCard.id !== 'new') {
      let arrayDescription: Data[] = getDescription(false).arrayDescription;
      let arraDataUpdate: {
        order_num: number;
        block_data: string;
        block_description_result: number;
        id: number;
        block_insert_data_type: number | null;
      }[] = getDataInformation(false).arrayDataUpdate;

      let arraDataCreate: {
        order_num: number;
        block_data: string;
        block_description_result: number;
      }[] = getDataInformation(false).arrayDataCreate;

      dispatch(updateBlockDescriptionResult(arrayDescription));
      dispatch(updateBlockData(arraDataUpdate));
      dispatch(createBlockData(arraDataCreate));
      dispatch(deleteBlockData(deletedBlockData));
      dispatch(setResult(false));
      dispatch(setBtn(0));
    }
    //карточка не создана, создание карточки
    else if (activeCard.id === 'new') {
      //1 шаг
      if (cardItems[0] !== undefined) {
        dispatch(
          createCardResult({
            language: activeLang,
            service_item: activeService,
            company_group: searchParams.get('company_group'),
            card_item: cardItems[0].id,
          })
        );
      } else {
      }
    }
  }

  function reactToSwitchingServices(
    serviceId: number,
    card_item: number | undefined
  ) {
    setTimeout(() => {
      dispatch(setActiveService(serviceId));

      dispatch(setActiveCardItem(cardItems[0].id));

      if (card_item !== undefined) {
        dispatch(
          loadCard({
            serv: serviceId,
            lang: activeLang,
            company_group: searchParams.get('company_group'),
            card_item: card_item,
          })
        );
      } else {
        console.log('card_item === undefined');
      }
    }, 500);
  }

  async function saveCard(serviceId?: number, card_item?: number) {
    setIsConfirm(true);
    while (true) {
      await waitForChange('Сохранить изменения?'); // Wait until targetObj.x has been changed.
      if (resultConfirm === 'btn_close') {
        setIsConfirm(false);
      } else if (resultConfirm === 'btn-true') {
        dispatch(setIsChangedCard(false));
        if (serviceId !== undefined) {
          reactToSwitchingServices(serviceId, card_item);
        }
        setIsConfirm(false);
        firstStepForSave();
      } else if (resultConfirm === 'btn-false') {
        dispatch(setIsChangedCard(false));
        if (serviceId !== undefined) {
          reactToSwitchingServices(serviceId, card_item);
        }

        setIsConfirm(false);
      }
      await new Promise((resolve) => setTimeout(resolve, 0)); // Making the dialog to show properly. You will not need this line in your code.
    }
  }

  return (
    <>
      <div className="window-layout">
        <div className="header services">
          <div className="header_title">Услуги</div>

          <Dropdown
            options={modalities}
            activeOption={activeModality}
            setActiveOption={setActiveOption}
            string={'short_name_string_id'}
          />

          <ChangeLang />

          <div className="header_buttons">
            <ButtonWithIcon
              iconActive={del}
              toolTip="Удалить карточку"
              right={60}
              top={40}
              iconDisabled={nodel}
              onClick={() => deleteCard()}
              isDisabled={activeCard.id === null || activeCard.id === -1}
            />
            <ButtonWithIcon
              iconActive={add}
              iconDisabled={noadd}
              onClick={() => dispatch(setNewCard())}
              toolTip="Добавить карточку"
              right={0}
              top={40}
              isDisabled={
                activeService === null ||
                (activeService !== null &&
                  activeCard.id !== null &&
                  activeCard.id !== -1)
              }
            />

            <ButtonWithIcon
              iconActive={save}
              iconDisabled={nosave}
              onClick={() => saveCard()}
              toolTip="Сохранить карточку"
              right={0}
              top={40}
              isDisabled={
                activeCard.id == null || activeCard.id === -1 ? true : false
              }
            />
          </div>
        </div>

        <div className={styles.content}>
          {!loadServicesFulfilled && <Loader />}
          {loadServicesFulfilled && (
            <ul className={styles.list}>
              {services.map((el: any, index: number) => (
                <li
                  key={index}
                  className={classNames(
                    styles.list_item,
                    el.id === activeService ? styles.active : null,

                    el.is_enabled === 0
                      ? classNames(styles.notActive)
                      : classNames()
                  )}
                  onClick={() =>
                    selectService(el.id, el.card_item, el.is_enabled)
                  }>
                  <span
                    className={classNames(
                      el.service_item_type !== 1
                        ? classNames(styles.child)
                        : classNames()
                    )}>
                    {el.service.string !== null ? el.service.string : 'NULL'}
                  </span>
                  <div
                    style={{
                      width: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>
                    {/* <span>{el.id}</span> */}
                    {el.card_result === 1 && (
                      <img
                        src={greenCheck}
                        alt="check"
                        width={10}
                        height={10}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isConfirm && <ConfirmWindow {...props} />}
    </>
  );
};
