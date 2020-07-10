import React from "react"
import { render, cleanup } from "@testing-library/react"
import App from "./App"
import { AppStateContext, AppDispatchContext } from "./contexts/appContext"
import { SocketStateContext } from "./contexts/socketContext"

afterEach(cleanup)
let dispatch = jest.fn()
describe("App", () => {
  test("renders App component", () => {
    render(
      <AppDispatchContext.Provider value={dispatch}>
        <AppStateContext.Provider value={{ isDark: false }}>
          <SocketStateContext.Provider
            value={{ socketState: { data: [] }, socket: {} }}
          >
            <App />
          </SocketStateContext.Provider>
        </AppStateContext.Provider>
      </AppDispatchContext.Provider>
    )
  })
})
