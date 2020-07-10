/*import React from "react"
import { render } from "@testing-library/react"
import { ThemeProvider } from "@material-ui/core/styles"
import { AppStateContext, AppDispatchContext } from "../src/contexts/appContext"
import {
  AddPanelStateContext,
  AddPanelDispatchContext,
} from "../src/contexts/addPanelContext"
import {
  SocketStateContext,
  SocketDispatchContext,
} from "../src/contexts/socketContext"

const AllTheProviders = ({ children }) => {
  return (
    <ThemeProvider>
      <AppStateContext>
        <AppDispatchContext>
          <SocketStateContext>
            <SocketDispatchContext>
              <AddPanelStateContext>
                <AddPanelDispatchContext>{children}</AddPanelDispatchContext>
              </AddPanelStateContext>
            </SocketDispatchContext>
          </SocketStateContext>
        </AppDispatchContext>
      </AppStateContext>
    </ThemeProvider>
  )
}

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from "@testing-library/react"

// override render method
export { customRender as render }
*/
