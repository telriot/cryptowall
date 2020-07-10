import React from "react"
import { render, fireEvent, cleanup } from "@testing-library/react"
import AddButton from "./AddButton"
import {
  AddPanelDispatchContext,
  AddPanelStateContext,
} from "../../contexts/addPanelContext"
import { SocketStateContext } from "../../contexts/socketContext"

afterEach(cleanup)

let dispatch = jest.fn()
let socket = { current: { emit: jest.fn() } }
let addPanelState = {
  input: "",
  options: [],
  selection: "",
  loading: false,
}

const buttonRender = (
  addPanelState = addPanelState,
  socketState = { data: [] }
) =>
  render(
    <SocketStateContext.Provider value={{ socket, socketState }}>
      <AddPanelStateContext.Provider value={addPanelState}>
        <AddPanelDispatchContext.Provider value={dispatch}>
          <AddButton />
        </AddPanelDispatchContext.Provider>
      </AddPanelStateContext.Provider>
    </SocketStateContext.Provider>
  )

describe("AddButton tests", () => {
  let getByRole
  describe("On selection === undefined", () => {
    beforeEach(() => {
      return ({ getByRole } = buttonRender(addPanelState))
    })
    test("Button renders correctly", () => {
      expect(getByRole("button")).toBeDefined()
    })
    test("Button is disabled when no coin is selected", () => {
      expect(getByRole("button")).toBeDisabled()
    })
    test("No socket call on click if no coin is selected", () => {
      const button = getByRole("button")
      fireEvent.click(button)
      expect(socket.current.emit).not.toHaveBeenCalled()
    })
  })
  describe("On selection defined", () => {
    let getByRole
    let state = { selection: { code: "btc", id: "bitcoin", name: "Bitcoin" } }
    beforeEach(() => {
      return ({ getByRole } = buttonRender({
        ...addPanelState,
        ...state,
      }))
    })

    test("Button is active when a coin is selected", () => {
      expect(getByRole("button")).not.toBeDisabled()
    })
    test("Socket broadcasts new coin on button click when coin is selected", () => {
      socket.current.emit.mockReturnValue("")
      const button = getByRole("button")
      fireEvent.click(button)
      expect(socket.current.emit).toHaveBeenCalledWith("add coin", {
        id: state.selection.id,
        symbol: state.selection.code,
        name: state.selection.name,
      })
    })
    test("Clear selection dispatch is fired on click", () => {
      const button = getByRole("button")
      fireEvent.click(button)
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_SELECTION",
        selection: undefined,
      })
    })
    test("Clear input dispatch is fired on click", () => {
      const button = getByRole("button")
      fireEvent.click(button)
      expect(dispatch).toHaveBeenCalledWith({
        type: "SET_INPUT",
        input: "",
      })
    })
  })
  describe("On data.length > 5", () => {
    let data = [1, 2, 3, 4, 5, 6]
    beforeEach(() => {
      return ({ getByRole } = buttonRender(addPanelState, {
        data,
      }))
    })
    test("Button is disabled when cap is reached", () => {
      expect(getByRole("button")).toBeDisabled()
    })
  })
})
