import React from "react"
import { Button } from "@material-ui/core"
import {
  AddPanelStateContext,
  AddPanelDispatchContext,
} from "../../contexts/addPanelContext"
import { AppStateContext } from "../../contexts/appContext"
import { SocketStateContext } from "../../contexts/socketContext"

function AddButton() {
  const { selection } = React.useContext(AddPanelStateContext)
  const dispatch = React.useContext(AddPanelDispatchContext)
  const { socket, socketState } = React.useContext(SocketStateContext)
  const { baseCurrency } = React.useContext(AppStateContext)
  const handleAdd = (selection) => {
    if (!selection) return

    socket.current.emit("add coin", {
      id: selection.id,
      symbol: selection.code,
      name: selection.name,
      base: baseCurrency,
    })
    dispatch({
      type: "SET_SELECTION",
      selection: undefined,
    })
    dispatch({ type: "SET_INPUT", input: "" })
  }

  return (
    <div>
      <Button
        style={{ marginTop: "15px" }}
        fullWidth
        onClick={() => handleAdd(selection)}
        variant="contained"
        color="primary"
        disabled={(!selection, socketState.data.length >= 5)}
      >
        {socketState.data.length >= 5 ? "Coin cap reached" : "Add coin"}
      </Button>
    </div>
  )
}
export default AddButton
