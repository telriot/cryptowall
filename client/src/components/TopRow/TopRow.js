import React from "react"
import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import RangeSelector from "../RangeSelector/RangeSelector"
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch"

const useStyles = makeStyles((theme) => ({
  grid: { display: "flex", justifyContent: "space-between", flex: "1" },
}))
function TopRow(props) {
  const classes = useStyles()

  return (
    <Grid className={classes.grid} item xs={12}>
      <RangeSelector />
      <DarkModeSwitch />
    </Grid>
  )
}

export default TopRow
