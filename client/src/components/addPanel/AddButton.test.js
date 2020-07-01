import React from "react"
import { render, fireEvent, cleanup } from "@testing-library/react"
import AddButton from "./AddButton"
import {
  AddPanelDispatchContext,
  AddPanelStateContext,
} from "../../contexts/addPanelContext"
import { SocketStateContext } from "../../contexts/socketContext"

import axios from "axios"

afterEach(cleanup)

jest.mock("axios")
let socketState = { data: [] }

let dispatch = jest.fn()
let socket = { current: { emit: jest.fn() } }

describe("AddButton tests", () => {
  let state = {
    input: "",
    options: [],
    selection: "",
    loading: false,
  }
  let getByRole, getByText
  state.selection = ""
  describe("On selection === undefined", () => {
    beforeEach(() => {
      return ({ getByRole, getByText } = render(
        <SocketStateContext.Provider value={{ socket }}>
          <AddPanelStateContext.Provider value={state}>
            <AddPanelDispatchContext.Provider value={dispatch}>
              <AddButton />
            </AddPanelDispatchContext.Provider>
          </AddPanelStateContext.Provider>
        </SocketStateContext.Provider>
      ))
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
    let state = {
      input: "",
      options: [],
      selection: { code: "btc", id: "bitcoin", name: "Bitcoin" },
      loading: false,
    }
    beforeEach(() => {
      return ({ getByRole, getByText } = render(
        <SocketStateContext.Provider value={{ socket }}>
          <AddPanelStateContext.Provider value={state}>
            <AddPanelDispatchContext.Provider value={dispatch}>
              <AddButton />
            </AddPanelDispatchContext.Provider>
          </AddPanelStateContext.Provider>
        </SocketStateContext.Provider>
      ))
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
  })
})
