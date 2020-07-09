import React from "react"
import { fireEvent, render, cleanup } from "@testing-library/react"
import RangeSelector from "./RangeSelector"
import { AppStateContext, AppDispatchContext } from "../../contexts/appContext"
import { TYPES } from "../../contexts/types"

afterEach(cleanup)
let dispatch = jest.fn()

describe("RangeSelector tests", () => {
  let getAllByRole, getByText
  beforeEach(() => {
    return ({ getAllByRole, getByText } = render(
      <AppDispatchContext.Provider value={dispatch}>
        <AppStateContext.Provider value={{ isDark: false }}>
          <RangeSelector />
        </AppStateContext.Provider>
      </AppDispatchContext.Provider>
    ))
  })
  test("render the right number of buttons", () => {
    expect(getAllByRole("button").length).toEqual(4)
  })
  test("dispatch fires correctly on button click", () => {
    const button = getByText(/week/gi)
    fireEvent.click(button)
    expect(dispatch).toHaveBeenCalledWith({ type: TYPES.SET_RANGE, range: 7 })
  })
})
