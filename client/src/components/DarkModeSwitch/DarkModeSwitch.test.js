import React from "react"
import { render, cleanup, fireEvent } from "@testing-library/react"
import App from "../../App"
import { AppStateContext, AppDispatchContext } from "../../contexts/appContext"
import { SocketProvider } from "../../contexts/socketContext"
import { TYPES } from "../../contexts/types"
import { lightBg, darkBg } from "../../App"
const dispatch = jest.fn()

afterEach(cleanup)
const appRender = (appState, dispatch) =>
  render(
    <AppStateContext.Provider value={appState}>
      <AppDispatchContext.Provider value={dispatch}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )

describe("Dark mode is off", () => {
  let getByRole, getByTestId
  beforeEach(
    () => ({ getByRole, getByTestId } = appRender({ isDark: false }, dispatch))
  )
  test("Background is light when isDark is false", () => {
    expect(getByTestId("component-app")).toHaveStyle(`background: ${lightBg}`)
  })
  test("Clicking on the switch fires the correct action", () => {
    fireEvent.click(getByRole("checkbox"))
    expect(dispatch).toHaveBeenCalledWith({ type: TYPES.SET_THEME })
  })
})
describe("Dark mode is on", () => {
  let getByTestId
  beforeEach(() => ({ getByTestId } = appRender({ isDark: true }, dispatch)))
  test("Background is dark when isDark is true", () => {
    expect(getByTestId("component-app")).toHaveStyle(`background: ${darkBg}`)
  })
})
