import React from "react"
import { Paper, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 150,
    width: "100%",
  },
}))
function AddPanel() {
  const classes = useStyles()

  return (
    <Grid item xs={5}>
      <Paper
        className={classes.paper}
        elevation={2}
        data-test="component-add-panel"
      >
        Add Panel
      </Paper>
    </Grid>
  )
}

export default AddPanel
