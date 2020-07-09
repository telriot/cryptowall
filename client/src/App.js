import React from "react"
import { AddPanelProvider } from "./contexts/addPanelContext"
import Chart from "./components/chart/Chart"
import Currencies from "./components/currencies/Currencies"
import AddPanel from "./components/addPanel/AddPanel"
import { Container, Grid, useMediaQuery } from "@material-ui/core"
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles"
import TopRow from "./components/TopRow/TopRow"
import { AppStateContext } from "./contexts/appContext"

function App() {
  const state = React.useContext(AppStateContext)
  const useStyles = makeStyles((theme) => ({
    app: {
      background: state.isDark ? "#333" : "#FFFFFF",
    },
    container: {
      paddingTop: "20px",
      [theme.breakpoints.up("md")]: {
        paddingTop: 0,
        height: "100vh",
        display: "flex",
      },
    },
    selectors: { flex: 1, display: "flex", justifyContent: "space-between" },
    grid: {
      alignSelf: "center",
    },
  }))

  const presentTheme = state.isDark ? "dark" : "light"
  const customTheme = createMuiTheme({
    palette: {
      type: presentTheme,
    },
  })

  const isSM = useMediaQuery("(min-width:500px)")
  const classes = useStyles()
  return (
    <ThemeProvider theme={customTheme}>
      <div className={classes.app}>
        <Container className={classes.container} data-test="component-app">
          <Grid
            direction="column"
            justify="space-around"
            className={classes.grid}
            container
            spacing={isSM ? 5 : 2}
          >
            <Grid
              spacing={isSM ? 3 : 0}
              container
              item
              className={classes.selectors}
            >
              <TopRow />
            </Grid>
            <Chart />
            <Grid
              spacing={isSM ? 3 : 0}
              container
              item
              className={classes.selectors}
            >
              <Currencies />
              <AddPanelProvider>
                <AddPanel />
              </AddPanelProvider>
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  )
}

export default App
