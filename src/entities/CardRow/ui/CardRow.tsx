import { useEffect, useState } from 'react'
import { UploadImage } from 'features/UploadImage'
import styles from './CardRow.module.scss'
import classNames from 'classnames'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { setActiveRow } from 'widgets/ServiceCard'
import { Dropdown } from '@mc/numedy-ui-kit'
import {
  setIdBlockData,
  setBlockText,
  setDescriptionChanged,
} from 'widgets/ServiceCard'
import { BlockData, Block_description_result } from 'shared/interfaces'
import {
  setIsChangedCard,
  setSizeOfImg,
  setBlockInsertDataType,
} from '../index'

interface Props {
  data: Block_description_result
  index: number
}

export const CardRow = ({ data, index }: Props) => {
  const dispatch = useAppDispatch()
  const activeRow = useAppSelector((state) => state.cardReducer.activeRow)
  const activeCard = useAppSelector((state) => state.cardReducer.activeCard)
  const loadCardPatternResult = useAppSelector(
    (state) => state.cardReducer.loadCardPatternResult
  )

  useEffect(() => {
    if (data.id === activeRow) {
      dispatch(setDescriptionChanged({ id: activeRow, value: true }))
    }
  }, [activeRow, dispatch, data.id])

  useEffect(() => {}, [activeCard.id])

  const returnImage = (result: BlockData) => {
    if (result.id === undefined) {
      dispatch(setIdBlockData(null))
    } else {
      dispatch(setIdBlockData(result.id))
    }
  }

  const handleChangeText = (triger: { value: string; id: number }) => {
    dispatch(setBlockText({ id: triger.id, value: triger.value }))
  }

  const options = [
    { id: 3, string: 'ㅤ' },
    { id: 0, string: '1 изображение' },
    { id: 1, string: 'до 2 изображений' },
    { id: 2, string: 'до 3 изображений' },
  ]

  //const [activeOption, setOption] = useState(3)

  const activeOption = () => {
    if (data.block_insert_data_type === null) return 3
    else return Number(data.block_insert_data_type)
  }

  const setActiveOption = (option: { id: number; string: string }) => {
    let block_desk_res = activeCard.block_description_result.find((item) => {
      return item.id === activeRow
    })

    if (block_desk_res?.block_data.length === 0) {
      //setOption(option.id)

      dispatch(
        setBlockInsertDataType({ id: Number(activeRow), value: option.id })
      )

      if (option.id === 0) {
        dispatch(setSizeOfImg({ id: data.id, value: 1000 }))
      } else if (option.id === 1) {
        dispatch(setSizeOfImg({ id: data.id, value: 500 }))
      } else if (option.id === 2) {
        dispatch(setSizeOfImg({ id: data.id, value: 200 }))
      } else if (option.id === 3) {
        dispatch(setSizeOfImg({ id: data.id, value: 0 }))
      }
    } else {
      alert('Удалите изображения')
    }
  }

  return (
    <div
      className={classNames(
        styles.body,
        data.id === activeRow ? styles.active : null
      )}
      onClick={() => {
        if (activeCard.id !== -1) {
          if (activeRow !== data.id) {
            dispatch(setActiveRow(data.id))
            dispatch(setIsChangedCard(true))
          }
        }
      }}
    >
      <div className={styles.col}>
        <div className={styles.header}>
          {data.block_description_item.string}
        </div>
        {activeRow !== data.id ? (
          <div className={styles.content}>{data.block_text}</div>
        ) : (
          <div className={styles.content}>
            <textarea
              value={
                activeCard.block_description_result.find(
                  (item) => item.id === activeRow
                )?.block_text
              }
              onChange={(e) =>
                handleChangeText({ value: e.target.value, id: data.id })
              }
              name=""
              id=""
              className={styles.textarea}
            ></textarea>
          </div>
        )}
      </div>
      <div className={styles.col}>
        <div className={styles.header}>
          <span style={{ fontWeight: 'normal' }}>Добавить:</span>
        </div>
        <div className={styles.dropdown}>
          {!loadCardPatternResult && activeCard.id !== -1 ? (
            <Dropdown
              options={options}
              activeOption={activeOption()}
              setActiveOption={setActiveOption}
              string={'string'}
            />
          ) : (
            <div className={styles.Dropdown_disabled}>
              {
                options.find((item) => {
                  return item.id === activeOption()
                })?.string
              }
            </div>
          )}
        </div>
        <div className={styles.images}>
          <UploadImage
            {...data.block_data[0]}
            returnImage={returnImage}
            key={0}
            order_num={0}
            idRow={data.id}
            sizeOfImg={
              data.block_insert_data_type !== null
                ? Number(data.block_insert_data_type)
                : -1
            }
          />
          <UploadImage
            {...data.block_data[1]}
            returnImage={returnImage}
            key={1}
            order_num={1}
            idRow={data.id}
            sizeOfImg={
              data.block_insert_data_type !== null
                ? Number(data.block_insert_data_type)
                : -1
            }
          />
          <UploadImage
            {...data.block_data[2]}
            returnImage={returnImage}
            order_num={2}
            key={2}
            idRow={data.id}
            sizeOfImg={
              data.block_insert_data_type !== null
                ? Number(data.block_insert_data_type)
                : -1
            }
          />
        </div>
      </div>
    </div>
  )
}
