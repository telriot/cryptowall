import React from "react"
import { useAppState, useAppDispatch } from "../../contexts/appContext"
import { Button, ButtonGroup, useMediaQuery } from "@material-ui/core"
import { TYPES } from "../../contexts/types"

function RangeSelector() {
  const { range } = useAppState()
  const dispatch = useAppDispatch()
  const isSM = useMediaQuery("(min-width:500px)")
  const isXS = useMediaQuery("(max-width:400px)")
  const handleClick = (range) => () => {
    dispatch({ type: TYPES.SET_RANGE, range })
  }
  return (
    <ButtonGroup aria-label="outlined button group">
      <Button color={range === 1 ? "primary" : ""} onClick={handleClick(1)}>
        {isSM ? "1 Day" : isXS ? "D" : "Day"}
      </Button>
      <Button color={range === 7 ? "primary" : ""} onClick={handleClick(7)}>
        {isSM ? "1 Week" : isXS ? "W" : "Week"}
      </Button>
      <Button color={range === 30 ? "primary" : ""} onClick={handleClick(30)}>
        {isSM ? "1 Month" : isXS ? "M" : "Month"}
      </Button>
      <Button color={range === 365 ? "primary" : ""} onClick={handleClick(365)}>
        {isSM ? "1 Year" : isXS ? "Y" : "Year"}
      </Button>
    </ButtonGroup>
  )
}

export default RangeSelector
