import React from "react"
import Chip from "@material-ui/core/Chip"
import { useSocketState } from "../../contexts/socketContext"
import { useAppState, useAppDispatch } from "../../contexts/appContext"
import { palette } from "../chart/Chart"
import { makeStyles } from "@material-ui/core/styles"
import { TYPES } from "../../contexts/types"

function CurrencyItem({ coin, index }) {
  const state = useAppState()
  const { socket } = useSocketState()
  const dispatch = useAppDispatch()

  const useStyles = makeStyles((theme) => ({
    root: {
      margin: "0 7px 7px 0",
      [theme.breakpoints.down("500")]: {
        width: "100%",
        margin: "7px 7px 0px 0",
      },
    },
    outlinedPrimary: {
      border: `1px solid ${palette[index]}`,
      color: state.isDark ? "#bfbfbf" : "#616161",
    },
    deleteIconColorPrimary: {
      color: palette[index],
      "&:hover": { color: "#888888" },
    },
  }))

  const classes = useStyles()

  const handleDelete = (id) => () => {
    socket.current.emit("delete coin", id)
  }

  const handleClick = (coin) => () => {
    dispatch({ type: TYPES.TOGGLE_HIDE_COIN, coin })
  }

  return (
    <Chip
      classes={{
        deleteIconOutlinedColorPrimary: classes.deleteIconColorPrimary,
        outlinedPrimary: classes.outlinedPrimary,
        root: classes.root,
      }}
      variant="outlined"
      label={`${coin.name}: ${coin.value.toFixed(4)}$`}
      onClick={handleClick(coin.id)}
      onDelete={handleDelete(coin.id)}
      color={state.hiddenCoins.has(coin.id) ? "" : "primary"}
    />
  )
}

export default CurrencyItem
