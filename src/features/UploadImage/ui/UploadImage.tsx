import { addImg200 } from 'shared/icons/_index'
import { addImg500 } from 'shared/icons/_index'
import { addImg1000 } from 'shared/icons/_index'
import { disabledAddImg } from 'shared/icons/_index'

import style from './UploadImage.module.scss'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { setOpenModalWindowImage, setOrderNum } from '../index'
import { useEffect, useState } from 'react'
import { BlockData } from 'shared/interfaces'

interface Props {
  idRow: number
  id: number
  block_data: string
  returnImage: (result: BlockData) => void
  order_num: number
  sizeOfImg: number
}

export const UploadImage = ({ idRow, order_num, sizeOfImg }: Props) => {
  const dispatch = useAppDispatch()

  const activeCard = useAppSelector((state) => state.cardReducer.activeCard)

  const [src, setSrc] = useState<string>('')

  useEffect(() => {
    //часто выполняется, правильнее один раз загружать все картинки, а обновлять то, что требует обновления
    updateSrc()
  })

  function updateSrc() {
    let block_data = activeCard.block_description_result
      .find((item) => {
        return item.id === idRow
      })!
      .block_data.find((item) => {
        return item.order_num === order_num
      })?.block_data

    let url_block_data = activeCard.block_description_result
      .find((item) => {
        return item.id === idRow
      })!
      .block_data.find((item) => {
        return item.order_num === order_num
      })?.url_block_data

    if (url_block_data !== undefined) {
      setSrc(url_block_data)
    } else if (block_data !== undefined) {
      setSrc(block_data)
    } else {
      if (sizeOfImg === 0 && order_num === 0) {
        setSrc(addImg1000)
      } else if (sizeOfImg === 1 && (order_num === 0 || order_num === 1)) {
        setSrc(addImg500)
      } else if (sizeOfImg === 2) {
        setSrc(addImg200)
      } else {
        setSrc(disabledAddImg)
      }
    }
  }

  const handlePick = () => {
    if (activeCard.id !== -1) {
      if (src !== disabledAddImg) {
        dispatch(setOpenModalWindowImage(true))
        dispatch(setOrderNum(order_num))
      }
    }
  }

  return (
    <>
      <button className={style.button} onClick={handlePick}>
        {src.includes('blob') || src.includes('base64') ? (
          <img src={src} alt="" />
        ) : (
          <img src={` data:image/png;base64,${src}`} alt="" />
        )}
      </button>
    </>
  )
}
