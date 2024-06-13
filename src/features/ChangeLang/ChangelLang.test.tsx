import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as reduxHooks from 'app/hooks'
import * as actions from './model/lang-reducer'
import { ChangeLang } from './ui/ChangeLang'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import langReducer from './model/lang-reducer'

jest.mock('react-redux')
const mockedDispatch = jest.spyOn(reduxHooks, 'useAppDispatch')
const mockedSelector = jest.spyOn(reduxHooks, 'useAppSelector')

const renderWithRedux = (
  component: JSX.Element,
  {
    initialState,
    store = createStore(langReducer, initialState),
  }: { initialState?: { activeLang: number; langList: string[] }; store?: any }
) => {
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  }
}

const initialState = {
  activeLang: 0,
  langList: ['ru', 'en', 'fr'],
}

describe('ChangelLang', () => {
  mockedDispatch.mockReturnValue(jest.fn())
  it('успешное создание ChangelLang', () => {
    const view = render(<ChangeLang />)
    expect(view).toMatchSnapshot()
  })
  it('открытие выпадающего списка', async () => {
    const options = mockedSelector.mockReturnValue(['ru', 'en', 'fr'])
    render(<ChangeLang />)
    userEvent.click(screen.getByTestId('dropdown-lang'))
    expect(await screen.findByTestId('list-lang')).toBeInTheDocument()

    expect(await screen.findByText('ru')).toBeInTheDocument()
    expect(await screen.findByText('en')).toBeInTheDocument()
    expect(await screen.findByText('fr')).toBeInTheDocument()
  })
})
