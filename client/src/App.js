import React from "react"
import { AddPanelProvider } from "./contexts/addPanelContext"
import Chart from "./components/chart/Chart"
import Currencies from "./components/currencies/Currencies"
import AddPanel from "./components/addPanel/AddPanel"
import { Container, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import RangeSelector from "./components/RangeSelector/RangeSelector"
import DarkModeSwitch from "./components/DarkModeSwitch/DarkModeSwitch"
import BaseCurrencySelect from "./components/BaseCurrencySelect/BaseCurrencySelect"

const useStyles = makeStyles((theme) => ({
  container: { marginTop: 30 },
  selectors: { flex: 1, display: "flex", justifyContent: "space-between" },
}))

function App() {
  const classes = useStyles()
  return (
    <Container className={classes.container} data-test="component-app">
      <Grid container spacing={2}>
        <div className={classes.selectors}>
          {" "}
          <RangeSelector />
          <DarkModeSwitch />
        </div>

        <Chart />
        <Currencies />
        <AddPanelProvider>
          <AddPanel />
        </AddPanelProvider>
      </Grid>
    </Container>
  )
}

export default App
