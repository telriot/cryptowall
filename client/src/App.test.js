import React from "react"
import { render, screen, cleanup } from "@testing-library/react"
import App from "./App"
import { SocketStateContext } from "./contexts/socketContext"

afterEach(cleanup)

describe("App", () => {
  test("renders App component", () => {
    render(
      <SocketStateContext.Provider
        value={{ socketState: { data: [] }, socket: {} }}
      >
        <App />
      </SocketStateContext.Provider>
    )
  })
})
