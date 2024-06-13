import classNames from 'classnames';
import styles from './CardViewWindow.module.scss';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { greenKr, greenY } from 'shared/icons/_index';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiInstance } from 'shared/axios-instance';
import { usb } from 'shared/icons/_index';
import { setOpenСardViewReducer } from '../model/cardView-reducer';
import { loadViewCard } from 'entities/CardViewWindow';
import { useEffect, useState } from 'react';
import { formToJSON } from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Block_description_result } from 'shared/interfaces';

export const CardViewWindow = () => {
  const dispatch = useAppDispatch();
  const activeCard = useAppSelector((state) => state.cardReducer.activeCard);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLang = useAppSelector((state) => state.langReducer.activeLang);

  const card_item_pattern = useAppSelector(
    (state) => state.cardReducer.card_item_pattern
  );

  const loadViewCard = async (data: {
    idCard: number;
    type_request: number;
    serv: number;
    company_group: number | null;
    lang: number;
  }) =>
    await apiInstance({
      method: 'get',
      url: `/card_result/${
        data.idCard !== -1 ? data.idCard : card_item_pattern
      }/detail/?type_request=${data.type_request}`,
      params: {
        //idCard: data.idCard,
        type_request: data.type_request,

        service_item: data.serv,
        company_group: data.company_group,
        language: data.lang,
      },
    }).then((res) => {
      return res.data;
    });

  const [size, setSize] = useState<string>('');
  const [size1, setSize1] = useState<string>('');
  const [json, setJson] = useState<string | null>(null);

  useEffect(() => {
    // if (searchParams.get('company_group') !== 'null') {
    //   loadViewCard({
    //     idCard: Number(activeCard.id),
    //     type_request: 1,
    //     company_group: Number(searchParams.get('company_group')),
    //     serv: Number(activeCard.id),
    //     lang: activeLang,
    //   }).then((res) => {
    //     setSize(res)
    //   })
    // } else {
    //   loadViewCard({
    //     idCard: Number(activeCard.id),
    //     type_request: 1,
    //     company_group: null,
    //     serv: Number(activeCard.id),
    //     lang: activeLang,
    //   }).then((res) => {
    //     setSize(res)
    //   })
    // }
    // if (searchParams.get('company_group') !== 'null') {
    //   loadViewCard({
    //     idCard: Number(activeCard.id),
    //     type_request: 2,
    //     company_group: Number(searchParams.get('company_group')),
    //     serv: Number(activeCard.id),
    //     lang: activeLang,
    //   }).then((res) => {
    //     setSize(res)
    //   })
    // } else {
    //   loadViewCard({
    //     idCard: Number(activeCard.id),
    //     type_request: 2,
    //     company_group: null,
    //     serv: Number(activeCard.id),
    //     lang: activeLang,
    //   }).then((res) => {
    //     setSize(res)
    //   })
    // }
    // if (searchParams.get('company_group') !== 'null') {
    //   loadViewCard({
    //     idCard: Number(activeCard.id),
    //     type_request: 3,
    //     company_group: Number(searchParams.get('company_group')),
    //     serv: Number(activeCard.id),
    //     lang: activeLang,
    //   }).then((res) => {
    //     setSize1(res)
    //   })
    // } else {
    //   loadViewCard({
    //     idCard: Number(activeCard.id),
    //     type_request: 3,
    //     company_group: null,
    //     serv: Number(activeCard.id),
    //     lang: activeLang,
    //   }).then((res) => {
    //     setSize1(res)
    //   })
    // }
  }, []);

  let itemsForSort = [...activeCard.block_description_result];

  return (
    <>
      <div className={classNames(styles.background)}></div>
      <div className={classNames(styles.body)}>
        <div className="header cardView" style={{ background: '#6ab574' }}>
          <div className={classNames(styles.wrapper_header)}>
            <div>
              <div className={classNames(styles.header)}>
                Карточка описания услуги
              </div>
            </div>
          </div>

          <button
            className={classNames(styles.close_btn)}
            onClick={() => {
              dispatch(setOpenСardViewReducer(false));
            }}>
            <img src={greenKr} alt="close_btn" />
          </button>
        </div>
        <div className={classNames(styles.content)}>
          <div className={styles.h1}>
            {activeCard.full_name_modality} ({activeCard.modality})
          </div>
          <div className={styles.h2}>{activeCard.service_item}</div>
          {activeCard.block_description_result.length > 0
            ? itemsForSort
                .sort((a, b) => a.order_num - b.order_num)
                .map((el: Block_description_result, index: number) => (
                  <>
                    <div className={styles.h3}>
                      {el.block_description_item.string}
                    </div>
                    <div className={styles.text}>{el.block_text}</div>
                    <div className={styles.img}>
                      {el.block_data.map((item1) => (
                        <>
                          <img
                            src={` data:image/png;base64,${item1.block_data}`}
                            alt=""
                          />
                        </>
                      ))}
                    </div>
                  </>
                ))
            : null}
          {/* <div
            className={classNames(styles.header)}
            style={{ marginBottom: '10px' }}
          >
            <span>Web версия для сайта МедЭксперт</span>
          </div> */}
          {/* <div>
            <div
              dangerouslySetInnerHTML={{
                __html: String(size),
              }}
            />
          </div> */}

          {/* <div
            className={classNames(styles.header)}
            style={{ marginBottom: '10px' }}
          >
            <span>Мобильная версия для сайта МедЭксперт</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '360px' }}>
              <div
                dangerouslySetInnerHTML={{
                  __html: String(size1),
                }}
              />
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};
