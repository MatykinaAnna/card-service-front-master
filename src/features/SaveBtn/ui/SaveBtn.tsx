import { MouseEventHandler, useState } from 'react'
import { save, nosave } from 'shared/icons/_index'
import { setOpenConfirmReducer, setText, setBtn } from 'features/ConfirmWindow'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import style from './SaveBtn.module.scss'

interface Data {
  isDisabled: boolean
  toolTip?: string
  right?: number
  top?: number
  onClick: MouseEventHandler<HTMLButtonElement>
}

export const SaveBtn = ({ isDisabled, toolTip, right, top }: Data) => {
  const dispatch = useAppDispatch()

  const [display, setDisplay] = useState('none')

  return (
    <>
      <div className={style.container}>
        {isDisabled && (
          <button
            disabled={isDisabled}
            onMouseOver={() => setDisplay('inline-block')}
            onMouseOut={() => setDisplay('none')}
          >
            <img src={nosave} alt="save_btn" width={19} height={19} />
          </button>
        )}
        {!isDisabled && (
          <button
            onMouseOver={() => setDisplay('inline-block')}
            onMouseOut={() => setDisplay('none')}
          >
            <img src={save} alt="save_btn" />
          </button>
        )}
      </div>
      {toolTip && (
        <div
          className={style.toolTip}
          style={{
            right: `${right}px`,
            top: `${top}px`,
            display: `${display}`!,
          }}
        >
          <div>{toolTip}</div>
        </div>
      )}
    </>
  )
}
