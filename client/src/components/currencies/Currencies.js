import React from "react"
import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CurrencyItem from "./CurrencyItem"
import { SocketStateContext } from "../../contexts/socketContext"
const useStyles = makeStyles((theme) => ({
  grid: {
    marginBottom: "40px",
  },
}))

function Currencies() {
  const { socket, socketState } = React.useContext(SocketStateContext)
  const { data } = socketState
  const classes = useStyles()
  return (
    <Grid data-testid="component-currencies" item xs={12} md={7}>
      {data &&
        data.map((coin, index) => (
          <CurrencyItem key={coin._id} coin={coin} index={index} />
        ))}
    </Grid>
  )
}

export default Currencies
