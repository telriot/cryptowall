import React from "react"
import Chart from "./components/chart/Chart"
import Currencies from "./components/currencies/Currencies"
import AddPanel from "./components/addPanel/AddPanel"
import { Container, Grid } from "@material-ui/core"

function App() {
  return (
    <Container data-test="component-app">
      <Grid container spacing={2}>
        <Chart />
        <Currencies />
        <AddPanel />
      </Grid>
    </Container>
  )
}

export default App
