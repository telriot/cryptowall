import React from "react"
import { Button } from "@material-ui/core"
import {
  useAddPanelState,
  useAddPanelDispatch,
} from "../../contexts/addPanelContext"
import { useSocketState } from "../../contexts/socketContext"

function AddButton() {
  const { selection } = useAddPanelState()
  const dispatch = useAddPanelDispatch()
  const { socket, socketState } = useSocketState()
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
        style={{ marginTop: "15px" }}
        fullWidth
        onClick={() => handleAdd(selection)}
        variant="contained"
        color="primary"
        disabled={!selection || socketState.data.length >= 5}
      >
        {socketState.data.length >= 5 ? "Coin cap reached" : "Add coin"}
      </Button>
    </div>
  )
}
export default AddButton
