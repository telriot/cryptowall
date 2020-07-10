import React from "react"
import CurrencyItem from "./CurrencyItem"
import { Grid } from "@material-ui/core"
import { useSocketState } from "../../contexts/socketContext"

function Currencies() {
  const { socketState } = useSocketState()
  const { data } = socketState
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
