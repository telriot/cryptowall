import React from "react"
import Currencies from "./Currencies"
import { SocketStateContext } from "../../contexts/socketContext"
import { render, screen, cleanup } from "@testing-library/react"
import { AppStateContext } from "../../contexts/appContext"

afterEach(cleanup)

let socket = { current: { emit: jest.fn() } }
let socketState = {
  data: [
    { _id: "1234556776", code: "btc", id: "bitcoin", name: "Bitcoin" },
    { _id: "44444556776", code: "eth", id: "ethereum", name: "Ethereum" },
  ],
}
let appState = { hiddenCoins: new Set() }
describe("Currencies tests", () => {
  let getByText, getByRole, getByTestId, getAllByRole
  beforeEach(() => {
    return ({ getByText, getByRole, getByTestId, getAllByRole } = render(
      <AppStateContext.Provider value={appState}>
        <SocketStateContext.Provider value={{ socket, socketState }}>
          <Currencies />
        </SocketStateContext.Provider>
      </AppStateContext.Provider>
    ))
  })
  test("Currencies render successfully", () => {
    expect(getByTestId("component-currencies")).toBeDefined()
  })
  test("Render one currencyItem per element in socketState.data", () => {
    expect(getAllByRole("button").length).toEqual(socketState.data.length)
  })
})
