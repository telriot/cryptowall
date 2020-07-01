import React from "react"
import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import CurrencyItem from "./CurrencyItem"
import { SocketStateContext } from "../../contexts/socketContext"
const useStyles = makeStyles((theme) => ({
  paper: {
    height: 150,
    width: "100%",
  },
}))

function Currencies() {
  const { socket, socketState } = React.useContext(SocketStateContext)
  const { data } = socketState
  const classes = useStyles()
  return (
    <Grid item xs={7}>
      <Paper
        className={classes.paper}
        elevation={2}
        data-testid="component-currencies"
      >
        {data.map((coin) => (
          <CurrencyItem key={coin._id} coin={coin} />
        ))}
      </Paper>
    </Grid>
  )
}

export default Currencies
