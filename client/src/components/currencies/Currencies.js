import React from "react"
import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 150,
    width: "100%",
  },
}))

function Currencies() {
  const classes = useStyles()
  return (
    <Grid item xs={7}>
      <Paper
        className={classes.paper}
        elevation={2}
        data-test="component-currencies"
      >
        Currencies
      </Paper>
    </Grid>
  )
}

export default Currencies
