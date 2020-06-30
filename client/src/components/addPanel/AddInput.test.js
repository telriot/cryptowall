import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AddInput from "./AddInput"
import {
  AddPanelProvider,
  AddPanelDispatchContext,
  AddPanelStateContext,
} from "../../contexts/addPanelContext"
import axios from "axios"

afterEach(cleanup)

test("renders Add Input component", () => {
  render(
    <AddPanelProvider>
      <AddInput />
    </AddPanelProvider>
  )
})

describe("Autocomplete", () => {
  let getByText, getByRole, getByTestId
  const options = [
    { code: "btc", id: "bitcoin", name: "Bitcoin" },
    { code: "eth", id: "ethereum", name: "Ethereum" },
  ]

  let state = {
    input: "",
    options,
    selection: undefined,
    loading: false,
  }
  let dispatch = jest.fn()

  beforeEach(() => {
    return ({ getByText, getByRole, getByTestId } = render(
      <AddPanelStateContext.Provider value={state}>
        <AddPanelDispatchContext.Provider value={dispatch}>
          <AddInput />
        </AddPanelDispatchContext.Provider>
      </AddPanelStateContext.Provider>
    ))
  })
  describe("Input on change", () => {
    let input
    beforeEach(() => {
      input = getByRole("textbox")
      expect(input.value).toBe("")
      fireEvent.change(input, { target: { value: "bit" } })
    })
    test("Controlled input changes on input", () => {
      expect(input.value).toBe("bit")
    })
    test("Dispatch fires correctly on change", () => {
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_INPUT", input: "bit" })
    })
  })

  describe("Input on blur", () => {
    let input
    beforeEach(() => {
      input = getByRole("textbox")
      input.focus()
      fireEvent.change(document.activeElement, { target: { value: "bit" } })
      fireEvent.blur(document.activeElement)
    })
    test("Input resets on blur", () => {
      expect(input.value).toBe("")
    })
    test("Dispatch fires correctly on blur", () => {
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_INPUT", input: "" })
    })
  })

  describe("Autocomplete on selection", () => {
    let input
    beforeEach(() => {
      input = getByRole("textbox")
      input.focus()
      fireEvent.change(document.activeElement, { target: { value: "b" } })
      fireEvent.keyDown(document.activeElement, { key: "ArrowDown" })
      fireEvent.keyDown(document.activeElement, { key: "Enter" })
    })
    test("Autocomplete value changes on selection", () => {
      expect(input.value).toBe("Bitcoin")
    })
    test("Dispatch fires correctly on selection", () => {
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_SELECTION",
        selection: options[0],
      })
    })
  })
})
