import React from "react"
import { render, cleanup } from "@testing-library/react"
import App from "./App"
import { AppStateContext } from "./contexts/appContext"
import { SocketStateContext } from "./contexts/socketContext"

afterEach(cleanup)

describe("App", () => {
  test("renders App component", () => {
    render(
      <AppStateContext.Provider value={{ isDark: false }}>
        <SocketStateContext.Provider
          value={{ socketState: { data: [] }, socket: {} }}
        >
          <App />
        </SocketStateContext.Provider>
      </AppStateContext.Provider>
    )
  })
})
