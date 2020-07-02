import React from "react"
import AddInput from "./AddInput"
import {
  AddPanelDispatchContext,
  AddPanelStateContext,
} from "../../contexts/addPanelContext"
import { render, fireEvent, cleanup } from "@testing-library/react"
import axios from "axios"
import useDebounce from "../../hooks/useDebounce"

afterEach(cleanup)

jest.mock("axios")
jest.mock("../../hooks/useDebounce")

describe("AddInput on !selection", () => {
  useDebounce.mockReturnValue("b")
  let dispatch = jest.fn()
  let options = [
    { code: "btc", id: "bitcoin", name: "Bitcoin" },
    { code: "eth", id: "ethereum", name: "Ethereum" },
  ]
  let state = {
    input: "",
    options,
    selection: undefined,
    loading: false,
  }
  let getByRole

  beforeEach(() => {
    return ({ getByRole } = render(
      <AddPanelStateContext.Provider value={state}>
        <AddPanelDispatchContext.Provider value={dispatch}>
          <AddInput />
        </AddPanelDispatchContext.Provider>
      </AddPanelStateContext.Provider>
    ))
  })
  describe("Input on change", () => {
    test("Dispatch fires correctly on change", () => {
      getByRole("textbox").focus()
      fireEvent.change(document.activeElement, { target: { value: "bit" } })
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_INPUT",
        input: "bit",
      })
    })
    test("Dispatch resets input on blur if !selection", () => {
      getByRole("textbox").focus()
      fireEvent.blur(document.activeElement)
      expect(dispatch).toHaveBeenCalledWith({ type: "SET_INPUT", input: "" })
      expect(dispatch).not.toHaveBeenCalledWith({
        type: "SET_SELECTION",
        selection: "",
      })
    })
    test("Dispatch applies selected option on selection", () => {
      getByRole("textbox").focus()
      fireEvent.change(document.activeElement, { target: { value: "b" } })
      fireEvent.keyDown(document.activeElement, { key: "ArrowDown" })
      fireEvent.keyDown(document.activeElement, { key: "Enter" })
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_SELECTION",
        selection: state.options[0],
      })
    })
  })
})
describe("AddInput when selection", () => {
  useDebounce.mockReturnValue("b")
  let dispatch = jest.fn()
  let options = [
    { code: "btc", id: "bitcoin", name: "Bitcoin" },
    { code: "eth", id: "ethereum", name: "Ethereum" },
  ]
  let state = {
    input: "bit",
    options,
    selection: { code: "btc", id: "bitcoin", name: "Bitcoin" },
    loading: false,
  }
  let getByRole, getByLabelText, getByTestId

  beforeEach(() => {
    return ({ getByRole, getByLabelText, getByTestId } = render(
      <AddPanelStateContext.Provider value={state}>
        <AddPanelDispatchContext.Provider value={dispatch}>
          <AddInput />
        </AddPanelDispatchContext.Provider>
      </AddPanelStateContext.Provider>
    ))
  })

  test("Dispatch does not reset on blur", () => {
    getByRole("textbox").focus()
    fireEvent.blur(document.activeElement)
    expect(dispatch).not.toHaveBeenCalledWith({
      type: "SET_INPUT",
      input: "",
    })
    expect(dispatch).not.toHaveBeenCalledWith({
      type: "SET_SELECTION",
      selection: "",
    })
  })
})
