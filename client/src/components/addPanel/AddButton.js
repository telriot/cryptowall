import React from "react"
import { Button } from "@material-ui/core"
import {
  AddPanelStateContext,
  AddPanelDispatchContext,
} from "../../contexts/addPanelContext"
import { SocketStateContext } from "../../contexts/socketContext"

function AddButton() {
  const { selection } = React.useContext(AddPanelStateContext)
  const dispatch = React.useContext(AddPanelDispatchContext)
  const { socket } = React.useContext(SocketStateContext)
  const handleAdd = (selection) => {
    if (!selection) return

    socket.current.emit("add coin", {
      id: selection.id,
      symbol: selection.code,
      name: selection.name,
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
        onClick={() => handleAdd(selection)}
        variant="contained"
        color="primary"
        disabled={!selection}
      >
        Add coin
      </Button>
    </div>
  )
}
export default AddButton
