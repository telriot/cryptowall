import React from "react"
import { AddPanelProvider } from "./contexts/addPanelContext"
import Chart from "./components/chart/Chart"
import Currencies from "./components/currencies/Currencies"
import AddPanel from "./components/addPanel/AddPanel"
import { Container, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import {
  SocketStateContext,
  SocketDispatchContext,
} from "./contexts/socketContext"
const useStyles = makeStyles((theme) => ({
  container: { marginTop: 30 },
}))

function App() {
  const { socketState, socket } = React.useContext(SocketStateContext)
  const { data } = socketState
  const classes = useStyles()

  const handleAdd = () => {
    socket.current.emit("add coin", {
      id: "ripple",
      symbol: "xrp",
      name: "XRP",
    })
  }
  const handleDelete = (id) => () => {
    socket.current.emit("delete coin", id)
  }

  return (
    <Container className={classes.container} data-test="component-app">
      <Grid container spacing={2}>
        <Chart />
        <Currencies />
        <AddPanelProvider>
          <AddPanel />
        </AddPanelProvider>
      </Grid>
      <div>
        {data
          ? data.map((el) => (
              <p onClick={handleDelete(el.id)} key={el.id}>
                {el.symbol.toUpperCase()}: {el.usd}
              </p>
            ))
          : null}
      </div>
      <button onClick={handleAdd}>Test button</button>
    </Container>
  )
}

export default App
