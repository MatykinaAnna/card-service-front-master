import '@mc/numedy-ui-kit/dist/esm/index.css'
import { useState } from 'react'
import { useAppSelector, useAppDispatch } from 'app/hooks'
import { useParams, useSearchParams } from 'react-router-dom'
import styles from './ServiceCard.module.scss'
import { greenY, plug } from 'shared/icons/_index'
import { CardRow } from 'entities/CardRow'
import { Block_description_result, dropdownOption } from 'shared/interfaces'
import { useEffect, useRef } from 'react'
import {
  setActiveCardItem,
  setOutsideCard,
  setActiveRow,
  getCardPatternResult,
  setIsChangedCard,
  setDeletedBlockData,
} from '../model/card-reducer'
import { usb } from 'shared/icons/_index'
import { Dropdown } from '@mc/numedy-ui-kit'
import { loadCardItemLayout, loadCardItems } from '../model/thunks'

import {
  setFulfilledUpdateBlockDescriptionResult,
  setFulfilledUpdateBlockData,
  setFulfilledCreateBlockData,
  setFulfilledDeleteBlockData,
  setFulfilledCreateCardResult,
  setFulfilledCreateBlockDescriptionResult,
  setFulfilledDeleteCardResult,
  setOpenСardViewReducer,
  setEmptyTextForCard,
  delDeletedBlockData,
} from '../index'
import { spawn } from 'child_process'

export const ServiceCard = () => {
  const ref = useRef<null | HTMLParagraphElement>(null)
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeModality = useAppSelector(
    (state) => state.serviceReducer.activeModality
  )
  const outsideCard = useAppSelector((state) => state.cardReducer.outsideCard)
  const openModalWindowImage = useAppSelector(
    (state) => state.cardReducer.openModalWindowImage
  )
  const activeCard = useAppSelector((state) => state.cardReducer.activeCard)
  const activeCardItem = useAppSelector(
    (state) => state.cardReducer.activeCardItem
  )
  const activeService = useAppSelector(
    //id выбранного серсвиса
    (state) => state.serviceReducer.activeService
  )
  const cardItems = useAppSelector((state) => state.cardReducer.cardItems)
  const serviceId = useAppSelector((state) => state.serviceReducer.serviceId)
  const activeLang = useAppSelector((state) => state.langReducer.activeLang)
  const fulfilledUpdateBlockDescriptionResult = useAppSelector(
    (state) => state.cardReducer.fulfilledUpdateBlockDescriptionResult
  )
  const fulfilledUpdateBlockData = useAppSelector(
    (state) => state.cardReducer.fulfilledUpdateBlockData
  )
  const fulfilledCreateBlockData = useAppSelector(
    (state) => state.cardReducer.fulfilledCreateBlockData
  )
  const fulfilledDeleteBlockData = useAppSelector(
    (state) => state.cardReducer.fulfilledDeleteBlockData
  )
  const fulfilledDeleteCardResult = useAppSelector(
    (state) => state.cardReducer.fulfilledDeleteCardResult
  )
  const fulfilledCreateCardResult = useAppSelector(
    (state) => state.cardReducer.fulfilledCreateCardResult
  )
  const fulfilledCreateBlockDescriptionResult = useAppSelector(
    (state) => state.cardReducer.fulfilledCreateBlockDescriptionResult
  )

  const setActiveOption = (option: dropdownOption) => {
    dispatch(setActiveCardItem(option.id))

    if (activeCard.id === 'new') {
      dispatch(loadCardItemLayout(option.id))
    }
  }

  const [classNameForBtn, setClassNameForBtn] = useState('green-button1')

  useEffect(() => {
    if (
      fulfilledUpdateBlockDescriptionResult &&
      fulfilledUpdateBlockData &&
      fulfilledCreateBlockData &&
      fulfilledDeleteBlockData
    ) {
      console.log('Сохранение изменений успешно')
    }
    dispatch(delDeletedBlockData([]))
    dispatch(setFulfilledUpdateBlockDescriptionResult(false))
    dispatch(setFulfilledUpdateBlockData(false))
    dispatch(setFulfilledCreateBlockData(false))
    dispatch(setFulfilledDeleteBlockData(false))
  }, [
    fulfilledUpdateBlockDescriptionResult,
    fulfilledUpdateBlockData,
    fulfilledCreateBlockData,
    fulfilledDeleteBlockData,
    dispatch,
  ])

  useEffect(() => {
    if (fulfilledDeleteCardResult) {
      dispatch(setFulfilledDeleteCardResult(false))
    }
  }, [fulfilledDeleteCardResult, dispatch])

  useEffect(() => {
    if (fulfilledCreateCardResult) {
      dispatch(setFulfilledCreateCardResult(false))
    }
  }, [fulfilledCreateCardResult, dispatch])

  useEffect(() => {
    if (fulfilledCreateBlockDescriptionResult) {
      dispatch(setFulfilledCreateBlockDescriptionResult(false))
    }
  }, [fulfilledCreateBlockDescriptionResult, dispatch])

  useEffect(() => {
    if (activeModality > -1) {
      dispatch(loadCardItems(activeModality))
    }
    setClassNameForBtn('green-button1')
  }, [activeModality])

  useEffect(() => {
    const onBodyClick = (e: Event) => {
      if (ref.current && ref.current.contains(e.target as HTMLElement)) {
        return
      }

      if (ref.current !== null) {
        if (!openModalWindowImage) {
          dispatch(setActiveRow(null))
        }
      }
    }

    document.body.addEventListener('click', onBodyClick)

    return () => {
      document.body.removeEventListener('click', onBodyClick)
    }
  }, [openModalWindowImage])

  useEffect(() => {
    setClassNameForBtn('green-button1')

    if (activeCard.id === 'new') {
      dispatch(loadCardItemLayout(cardItems[0].id))
    }
  }, [activeCard.id])

  let itemsForSort = [...activeCard.block_description_result]

  return (
    <div className="window-layout">
      {activeCard.id === null ? (
        <img className="plug" src={plug} alt="" />
      ) : (
        <>
          <div className="header card">
            <div className="header_title">Карточка описания услуги</div>

            {!(
              activeCard.block_description_result.length === 0 ||
              !(activeCard.id === 'new')
            ) ? (
              <Dropdown
                options={cardItems}
                activeOption={activeCardItem}
                setActiveOption={setActiveOption}
                string={'string'}
              />
            ) : (
              <div className={styles.Dropdown_disabled}>
                {
                  cardItems.find((item) => {
                    return item.id === activeCardItem
                  })?.string
                }
              </div>
            )}

            {/* <button
              className={`${classNameForBtn}`}
              disabled={
                activeCard.block_description_result.length === 0 ||
                !(activeCard.id === 'new') ||
                searchParams.get('company_group') === 'null'
              }
              onClick={() => {
                dispatch(
                  getCardPatternResult({
                    serv: Number(activeService),
                    lang: activeLang,
                  })
                )
                dispatch(setIsChangedCard(true))
              }}
            >
              Для всех групп компаний
            </button> */}
            <div></div>
            <button
              className="green-button"
              disabled={activeCard.id === 'new'}
              onClick={() => {
                dispatch(setOpenСardViewReducer(true))
              }}
            >
              <img src={greenY} alt="" style={{ paddingRight: '4px' }} />
              Просмотр карточки
            </button>
          </div>

          <div className={styles.content} ref={ref}>
            {activeCard.block_description_result.length > 0
              ? itemsForSort
                  .sort((a, b) => a.order_num - b.order_num)
                  .map((el: Block_description_result, index: number) => (
                    <CardRow key={index} data={el} index={index} />
                  ))
              : null}
          </div>
        </>
      )}
    </div>
  )
}
