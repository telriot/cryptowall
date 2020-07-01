import React from "react"
import Currencies from "./Currencies"
import { SocketStateContext } from "../../contexts/socketContext"
import { render, fireEvent, cleanup } from "@testing-library/react"

afterEach(cleanup)

let socket = { current: { emit: jest.fn() } }
let socketState = {
  data: [
    { _id: "1234556776", code: "btc", id: "bitcoin", name: "Bitcoin" },
    { _id: "44444556776", code: "eth", id: "ethereum", name: "Ethereum" },
  ],
}
describe("Currencies tests", () => {
  let getByText, getByRole, getByTestId
  beforeEach(() => {
    return ({ getByText, getByRole, getByTestId } = render(
      <SocketStateContext.Provider value={{ socket, socketState }}>
        <Currencies />
      </SocketStateContext.Provider>
    ))
  })
  test("Currencies render successfully", () => {
    expect(getByTestId("component-currencies")).toBeDefined()
  })
  test("Render one currencyItem per element in socketState.data", () => {})
})
