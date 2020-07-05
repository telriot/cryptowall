import React from "react"
import Chip from "@material-ui/core/Chip"
import { SocketStateContext } from "../../contexts/socketContext"
import { AppStateContext, AppDispatchContext } from "../../contexts/appContext"
import { palette } from "../chart/Chart"
import { makeStyles } from "@material-ui/core/styles"

function CurrencyItem({ coin, index }) {
  const { socket, socketState } = React.useContext(SocketStateContext)
  const dispatch = React.useContext(AppDispatchContext)
  const state = React.useContext(AppStateContext)

  const handleDelete = (id) => () => {
    socket.current.emit("delete coin", id)
  }

  const handleClick = (coin) => () => {
    dispatch({ type: "TOGGLE_HIDE_COIN", coin })
  }
  const useStyles = makeStyles({
    root: { margin: "5px 7px 0 0" },
    outlinedPrimary: {
      border: `1px solid ${palette[index]}`,
      color: "#616161",
    },
    deleteIconColorPrimary: {
      color: palette[index],
    },
  })
  const classes = useStyles()

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
