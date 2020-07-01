import React from "react"
import { render, fireEvent, cleanup } from "@testing-library/react"
import AddButton from "./AddButton"
import {
  AddPanelDispatchContext,
  AddPanelStateContext,
} from "../../contexts/addPanelContext"
import axios from "axios"

afterEach(cleanup)

jest.mock("axios")

let state = {
  input: "",
  options: [],
  selection: undefined,
  loading: false,
}
let dispatch = jest.fn()

describe("AddButton tests", () => {
  let getByRole, queryAllByRole, queryByText
  axios.get.mockReturnValue({
    data: [],
  })
  beforeEach(() => {
    return ({ getByRole, queryAllByRole, queryByText } = render(
      <AddPanelStateContext.Provider value={state}>
        <AddPanelDispatchContext.Provider value={dispatch}>
          <AddButton />
        </AddPanelDispatchContext.Provider>
      </AddPanelStateContext.Provider>
    ))
  })

  test("Button renders correctly", () => {})
})
