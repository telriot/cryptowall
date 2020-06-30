import React from "react"
import { render, screen, cleanup } from "@testing-library/react"
import App from "./App"

afterEach(cleanup)

describe("App", () => {
  test("renders App component", () => {
    render(<App />)
  })
})
