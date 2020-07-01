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

let state = {
  input: "",
  options: [],
  selection: undefined,
  loading: false,
}
let dispatch = jest.fn()
describe("AddInput tests", () => {
  let getByRole, queryAllByRole, queryByText

  axios.get.mockReturnValue({
    data: [],
  })

  beforeEach(() => {
    return ({ getByRole, queryAllByRole, queryByText } = render(
      <AddPanelStateContext.Provider value={state}>
        <AddPanelDispatchContext.Provider value={dispatch}>
          <AddInput />
        </AddPanelDispatchContext.Provider>
      </AddPanelStateContext.Provider>
    ))
  })

  describe("Autocomplete", () => {
    state.options = [
      { code: "btc", id: "bitcoin", name: "Bitcoin" },
      { code: "eth", id: "ethereum", name: "Ethereum" },
    ]

    describe("Input on change", () => {
      let input
      beforeEach(() => {
        useDebounce.mockReturnValue("b")

        input = getByRole("textbox")
        expect(input.value).toBe("")
        fireEvent.change(input, { target: { value: "bit" } })
      })
      test("Controlled input changes on input", () => {
        expect(input.value).toBe("bit")
      })
      test("Dispatch fires correctly on change", () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: "SET_INPUT",
          input: "bit",
        })
      })
    })

    describe("Input on blur", () => {
      useDebounce.mockReturnValue("")

      let input
      beforeEach(() => {
        input = getByRole("textbox")
        input.focus()
        fireEvent.change(document.activeElement, { target: { value: "b" } })
        fireEvent.blur(document.activeElement)
      })
      test("Input resets on blur", () => {
        expect(input.value).toBe("")
      })
      test("Dispatch fires correctly on blur", () => {
        expect(dispatch).toHaveBeenCalledWith({ type: "SET_INPUT", input: "" })
        expect(dispatch).not.toHaveBeenCalledWith({
          type: "SET_SELECTION",
          selection: "",
        })
      })
    })

    describe("Autocomplete on selection", () => {
      useDebounce.mockReturnValue("b")

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
          selection: state.options[0],
        })
      })
    })
  })

  describe("Axios calls", () => {
    test("No Axios call for coin list if debouncedInput.length <=1", async () => {
      useDebounce.mockReturnValue("b")
      let input = getByRole("textbox")
      input.focus()
      fireEvent.change(document.activeElement, {
        target: { value: "b" },
      })
      expect(axios.get).not.toHaveBeenCalled()
    })
    test("Axios call for coin list if debouncedInput.length >1", async () => {
      useDebounce.mockReturnValue("bitcoin")
      let input = getByRole("textbox")
      input.focus()
      fireEvent.change(document.activeElement, {
        target: { value: "bitcoin" },
      })
      expect(axios.get).toHaveBeenCalledWith("api/coins/autocomplete/", {
        params: { input: "bitcoin" },
      })
    })
  })

  describe("Popper", () => {
    state.options = [
      { code: "btc", id: "bitcoin", name: "Bitcoin" },
      { code: "btcg", id: "bitcoingold", name: "Bitcoin Gold" },
      { code: "eth", id: "ethereum", name: "Ethereum" },
    ]

    test("Popper renders no options div with no matches", () => {
      let input = getByRole("textbox")
      input.focus()
      fireEvent.change(document.activeElement, {
        target: { value: "x" },
      })
      expect(queryByText("No options")).toBeTruthy()
    })
    test("Popper list items render correct state options when open", () => {
      let input = getByRole("textbox")
      input.focus()
      fireEvent.change(document.activeElement, {
        target: { value: "b" },
      })
      expect(queryAllByRole("option").length).toEqual(2)
    })
    test("Popper hides on blur when options are 0", () => {
      let input = getByRole("textbox")
      input.focus()
      fireEvent.change(document.activeElement, {
        target: { value: "x" },
      })
      input.blur()
      expect(queryByText("No options")).toBeFalsy()
    })
    test("Popper hides on blur when options are > 0", () => {
      let input = getByRole("textbox")
      input.focus()
      fireEvent.change(document.activeElement, {
        target: { value: "bit" },
      })
      input.blur()
      expect(queryAllByRole("option").length).toEqual(0)
    })
  })
})
