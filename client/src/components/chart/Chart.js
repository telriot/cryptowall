import React from "react"
import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 500,
    width: "100%",
  },
}))

function Chart() {
  const classes = useStyles()

  return (
    <Grid item xs={12}>
      <Paper
        className={classes.paper}
        elevation={2}
        data-test="component-chart"
      >
        Chart
      </Paper>
    </Grid>
  )
}

export default Chart
