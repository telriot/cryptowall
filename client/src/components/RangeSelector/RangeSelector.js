import React from "react"
import { AppStateContext, AppDispatchContext } from "../../contexts/appContext"
import { Button, ButtonGroup } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { TYPES } from "../../contexts/types"

const useStyles = makeStyles((theme) => ({}))
function RangeSelector() {
  const { range } = React.useContext(AppStateContext)
  const dispatch = React.useContext(AppDispatchContext)
  const classes = useStyles()
  const handleClick = (range) => () => {
    dispatch({ type: TYPES.SET_RANGE, range })
  }
  return (
    <ButtonGroup aria-label="outlined button group">
      <Button color={range === 1 ? "primary" : ""} onClick={handleClick(1)}>
        1 Day
      </Button>
      <Button color={range === 7 ? "primary" : ""} onClick={handleClick(7)}>
        1 Week
      </Button>
      <Button color={range === 30 ? "primary" : ""} onClick={handleClick(30)}>
        1 Month
      </Button>
      <Button color={range === 365 ? "primary" : ""} onClick={handleClick(365)}>
        1 Year
      </Button>
    </ButtonGroup>
  )
}

export default RangeSelector
