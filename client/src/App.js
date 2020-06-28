import React from "react"
import Chart from "./components/chart/Chart"
import Currencies from "./components/currencies/Currencies"
import AddPanel from "./components/addPanel/AddPanel"

function App() {
  return (
    <div data-test="component-app">
      <h1>portfolio-app</h1>
      <Chart />
      <Currencies />
      <AddPanel />
    </div>
  )
}

export default App
