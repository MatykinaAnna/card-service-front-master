import { useState, useEffect, useRef } from 'react'
import style from './ChangeLang.module.scss'
import { ruFlag, enFlag, frFlag, dropLang } from 'shared/icons/_index'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { setActiveLang } from '../model/lang-reducer'

export const ChangeLang = () => {
  const dispatch = useAppDispatch()
  const ref = useRef<null | HTMLParagraphElement>(null)
  const [isOpen, setOpen] = useState(false)

  const activeLang = useAppSelector((state) => state.langReducer.activeLang)
  //const options = useAppSelector((state) => state.langReducer.langList)
  const options = ['ru', 'en', 'fr']

  const getFlag = (id: number) => {
    switch (id) {
      case 1:
        return ruFlag

      case 2:
        return enFlag

      case 3:
        return frFlag
    }
  }

  const onClickItem = (id: number) => {
    setOpen(false)
    dispatch(setActiveLang(id))
  }

  useEffect(() => {
    const onBodyClick = (e: Event) => {
      if (ref.current && ref.current.contains(e.target as HTMLElement)) {
        return
      }
      setOpen(false)
    }

    document.body.addEventListener('click', onBodyClick)

    return () => {
      document.body.removeEventListener('click', onBodyClick)
    }
  }, [])

  return (
    <div className={style.container}>
      <div className={style.ref} ref={ref}>
        <button
          className={style.button}
          onClick={() => setOpen(!isOpen)}
          data-testid="dropdown-lang"
        >
          <img
            className={style.main_flag}
            src={getFlag(activeLang)}
            alt="flag"
          />
          <img className={style.arrow} src={dropLang} alt="switc" />
        </button>
        {isOpen && (
          <div className={style.options} data-testid="list-lang">
            {options.map((el, index) => (
              <div
                key={index}
                className={style.options_item}
                onClick={() => onClickItem(index + 1)}
                data-testid="item-lang"
              >
                <img
                  className={style.mini_flag}
                  src={getFlag(index + 1)}
                  alt=""
                />
                <span>{el}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
