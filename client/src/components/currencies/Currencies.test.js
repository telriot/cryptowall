import React from "react"
import Currencies from "./Currencies"
import { SocketStateContext } from "../../contexts/socketContext"
import { render, cleanup } from "@testing-library/react"
import { AppContextProvider } from "../../contexts/appContext"

afterEach(cleanup)

let socketState = {
  data: [
    {
      _id: "1234556776",
      code: "btc",
      id: "bitcoin",
      name: "Bitcoin",
      value: 9999,
    },
    {
      _id: "44444556776",
      code: "eth",
      id: "ethereum",
      name: "Ethereum",
      value: 222,
    },
  ],
}
describe("Currencies tests", () => {
  let getByTestId, getAllByRole
  beforeEach(() => {
    return ({ getByTestId, getAllByRole } = render(
      <AppContextProvider>
        <SocketStateContext.Provider value={{ socketState }}>
          <Currencies />
        </SocketStateContext.Provider>
      </AppContextProvider>
    ))
  })
  test("Currencies render successfully", () => {
    expect(getByTestId("component-currencies")).toBeDefined()
  })
  test("Render one currencyItem per element in socketState.data", () => {
    expect(getAllByRole("button").length).toEqual(socketState.data.length)
  })
})
