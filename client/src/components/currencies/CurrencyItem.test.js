import React from "react"
import CurrencyItem from "./CurrencyItem"
import { SocketStateContext } from "../../contexts/socketContext"
import { render, fireEvent, cleanup } from "@testing-library/react"
import axios from "axios"

afterEach(cleanup)

let socket = { current: { emit: jest.fn() } }
let coin = { _id: "1234556776", code: "btc", id: "bitcoin", name: "Bitcoin" }
describe("CurrencyItem tests", () => {
  let getByText, getByRole, getByTestId, getAllByRole

  beforeEach(() => {
    return ({ getByText, getByRole, getByTestId, getAllByRole } = render(
      <SocketStateContext.Provider value={{ socket }}>
        <CurrencyItem coin={coin} />
      </SocketStateContext.Provider>
    ))
  })

  test("CurrencyItem renders successfully", () => {
    expect(getByText(/Bitcoin/)).toBeDefined()
  })
  test("Socket.emit fires with right parameters on delete action", () => {
    socket.current.emit.mockReturnValue("Coin successfully deleted")
    getByRole("button").focus()
    fireEvent.keyUp(document.activeElement, { key: "Delete" })
    expect(socket.current.emit).toHaveBeenCalledWith("delete coin", coin.id)
  })
  // TODO test("Do something on button click, maybe higlight chart line")
})
