import React from "react"
import AddInput from "./AddInput"
import {
  AddPanelDispatchContext,
  AddPanelStateContext,
} from "../../contexts/addPanelContext"
import { render, fireEvent, cleanup } from "@testing-library/react"
import useDebounce from "../../hooks/useDebounce"

afterEach(cleanup)
let dispatch = jest.fn()
let state = {
  input: "",
  options: [],
  selection: undefined,
  loading: false,
}
jest.mock("../../hooks/useDebounce")

const inputRender = (state, dispatch) =>
  render(
    <AddPanelStateContext.Provider value={state}>
      <AddPanelDispatchContext.Provider value={dispatch}>
        <AddInput />
      </AddPanelDispatchContext.Provider>
    </AddPanelStateContext.Provider>
  )

describe("AddInput on !selection", () => {
  useDebounce.mockReturnValue("b")
  let dispatch = jest.fn()
  let options = [
    { code: "btc", id: "bitcoin", name: "Bitcoin" },
    { code: "eth", id: "ethereum", name: "Ethereum" },
  ]

  let getByRole

  beforeEach(() => {
    return ({ getByRole } = inputRender({ ...state, options }, dispatch))
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
        selection: options[0],
      })
    })
  })
})
describe("AddInput when selection", () => {
  useDebounce.mockReturnValue("b")
  let options = [
    { code: "btc", id: "bitcoin", name: "Bitcoin" },
    { code: "eth", id: "ethereum", name: "Ethereum" },
  ]
  let selection = { selection: { code: "btc", id: "bitcoin", name: "Bitcoin" } }
  let getByRole

  beforeEach(() => {
    return ({ getByRole } = inputRender(
      { ...state, ...selection, options },
      dispatch
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
