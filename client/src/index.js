import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import "./index.css"
import { AppContextProvider } from "./contexts/appContext"
import { SocketProvider } from "./contexts/socketContext"

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
