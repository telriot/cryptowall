import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import AppContextProvider from "./contexts/AppContext"

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
)
