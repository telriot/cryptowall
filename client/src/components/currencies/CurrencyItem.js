import React from "react"
import Chip from "@material-ui/core/Chip"
import { SocketStateContext } from "../../contexts/socketContext"
function CurrencyItem({ coin }) {
  const { socket, socketState } = React.useContext(SocketStateContext)

  const handleDelete = (id) => () => {
    socket.current.emit("delete coin", id)
  }

  const handleClick = () => {
    console.info("You clicked the Chip.")
  }

  return (
    <Chip
      label={`${coin.name}: ${coin.usd}`}
      onClick={handleClick}
      onDelete={handleDelete(coin.id)}
    />
  )
}

export default CurrencyItem
