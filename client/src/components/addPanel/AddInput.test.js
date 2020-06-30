import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AddInput from "./AddInput"
import addPanelContext from "../../contexts/addPanelContext"
import axios from "axios"
import { Autocomplete } from "@material-ui/lab"

afterEach(cleanup)
jest.mock("axios")

describe("Add Input", () => {
  let getByText, getByRole, getByTestId
  beforeEach(
    () =>
      ({ getByText, getByRole, getByTestId } = render(
        <addPanelContext.AddPanelProvider>
          <AddInput />
        </addPanelContext.AddPanelProvider>
      ))
  )
  test("renders Add Input component", () => {
    render(
      <addPanelContext.AddPanelProvider>
        <AddInput />
      </addPanelContext.AddPanelProvider>
    )
  })
  test("Context input value is updated by input field", () => {
    const input = getByRole("textbox")
    expect(input.value).toBe("")
    fireEvent.change(input, { target: { value: "bitcoin" } })
    expect(input.value).toBe("bitcoin")
  })
})
describe("Autocomplete", () => {
  let getByText, getByRole, getByTestId
  let state = {
    input: "",
    options: [
      { code: "btc", id: "bitcoin", name: "Bitcoin" },
      { code: "eth", id: "ethereum", name: "Ethereum" },
    ],
    selection: undefined,
    loading: false,
  }
  let dispatch = jest.fn((payload) => {
    console.log("dispatch", payload)
  })
  const mockHandleChange = jest.fn((payload) =>
    console.log("handlechange", payload)
  )
  beforeEach(() => {
    return ({ getByText, getByRole, getByTestId } = render(
      <addPanelContext.AddPanelStateContext.Provider value={state}>
        <addPanelContext.AddPanelDispatchContext.Provider value={dispatch}>
          <AddInput />
        </addPanelContext.AddPanelDispatchContext.Provider>
      </addPanelContext.AddPanelStateContext.Provider>
    ))
  })

  test("Context selection is updated by autocomplete selection", () => {
    const input = getByRole("textbox")
    const autocomplete = getByTestId("autocomplete")
    input.focus()
    fireEvent.change(document.activeElement, { target: { value: "b" } })
    fireEvent.keyDown(document.activeElement, { key: "ArrowDown" })
    fireEvent.keyDown(document.activeElement, { key: "Enter" })
    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_SELECTION",
      selection: { code: "btc", id: "bitcoin", name: "Bitcoin" },
    })
  })
})
