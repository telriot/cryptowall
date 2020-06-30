import React, { useState, useEffect, useRef } from "react"
import addPanelContext from "./contexts/addPanelContext"
import Chart from "./components/chart/Chart"
import Currencies from "./components/currencies/Currencies"
import AddPanel from "./components/addPanel/AddPanel"
import { Container, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import socketIOClient from "socket.io-client"
import axios from "axios"

const useStyles = makeStyles((theme) => ({
  container: { marginTop: 30 },
}))

function App() {
  const [data, setData] = useState([])
  const classes = useStyles()
  let socket = useRef()

  const getInitialData = async () => {
    try {
      const results = await axios.get("/api/coins")
      setData(results.data)
    } catch (error) {
      console.log(error)
    }
  }
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

  useEffect(() => {
    getInitialData()
    socket.current = socketIOClient("/")
    socket.current.on("FromAPI", (data) => {
      console.log(data)
      setData(data)
    })
    return () => socket.current.disconnect()
  }, [])
  return (
    <Container className={classes.container} data-test="component-app">
      <Grid container spacing={2}>
        <Chart />
        <Currencies />
        <addPanelContext.AddPanelProvider>
          <AddPanel />
        </addPanelContext.AddPanelProvider>
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
