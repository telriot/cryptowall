import React from "react"
import {
  render,
  screen,
  fireEvent,
  cleanup,
  getByRole,
} from "@testing-library/react"
import AddInput from "./AddInput"
import { AddPanelProvider } from "../../contexts/addPanelContext"
import { text } from "express"

afterEach(cleanup)

describe("Add Input", () => {
  let getByText, getByRole
  beforeEach(
    () =>
      ({ getByText, getByRole } = render(
        <AddPanelProvider>
          <AddInput />
        </AddPanelProvider>
      ))
  )
  test("renders Add Input component", () => {
    render(
      <AddPanelProvider>
        <AddInput />
      </AddPanelProvider>
    )
  })
  test("Context value is updated by child component", () => {
    expect(getByRole("textbox").value).toBe("")
    fireEvent.change(getByRole("textbox"), { target: { value: "bitcoin" } })
    expect(getByRole("textbox").value).toBe("bitcoin")
  })
})
