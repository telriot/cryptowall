import React from "react"
import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import AddInput from "./AddInput"
import AddButton from "./AddButton"

const useStyles = makeStyles((theme) => ({
  paper: {
    height: 150,
    width: "100%",
  },
  panelDiv: {
    width: "100%",
  },
}))
function AddPanel() {
  const classes = useStyles()

  return (
    <Grid item xs={5}>
      <div className={classes.panelDiv}>
        <AddInput />
        <AddButton />
      </div>
    </Grid>
  )
}

export default AddPanel
