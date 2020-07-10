import React from "react"
import CurrencyItem from "./CurrencyItem"
import { SocketStateContext } from "../../contexts/socketContext"
import { render, fireEvent, cleanup } from "@testing-library/react"
import { AppStateContext, AppDispatchContext } from "../../contexts/appContext"

afterEach(cleanup)

const socket = { current: { emit: jest.fn() } }
const coin = {
  _id: "1234556776",
  code: "btc",
  id: "bitcoin",
  name: "Bitcoin",
  value: 9999,
}
const appState = { isDark: true, hiddenCoins: new Set() }
const dispatch = jest.fn()

describe("CurrencyItem tests", () => {
  let getByText, getByRole

  beforeEach(() => {
    return ({ getByText, getByRole } = render(
      <AppStateContext.Provider value={appState}>
        <AppDispatchContext.Provider value={dispatch}>
          <SocketStateContext.Provider value={{ socket }}>
            <CurrencyItem coin={coin} />
          </SocketStateContext.Provider>
        </AppDispatchContext.Provider>
      </AppStateContext.Provider>
    ))
  })

  test("CurrencyItem renders successfully", () => {
    expect(getByText(/Bitcoin/)).toBeDefined()
  })
  test("Button shows the right value", () => {
    expect(getByRole("button").textContent).toMatch("9999")
  })
  test("Socket.emit fires with right parameters on delete action", () => {
    fireEvent.keyUp(getByRole("button"), { key: "Delete" })
    expect(socket.current.emit).toHaveBeenCalledWith("delete coin", coin.id)
  })
  test("Dispatch fires correctly on button click", () => {
    fireEvent.click(getByRole("button"))
    expect(dispatch).toHaveBeenCalledWith({
      type: "TOGGLE_HIDE_COIN",
      coin: coin.id,
    })
  })
})
