import React from "react"
import InputLabel from "@material-ui/core/InputLabel"
import MenuItem from "@material-ui/core/MenuItem"
import FormControl from "@material-ui/core/FormControl"
import Select from "@material-ui/core/Select"
import { makeStyles } from "@material-ui/core/styles"
import { AppStateContext, AppDispatchContext } from "../../contexts/appContext"
import { SocketStateContext } from "../../contexts/socketContext"
import { TYPES } from "../../contexts/types"

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}))

function BaseCurrencySelect() {
  const { socket } = React.useContext(SocketStateContext)
  const state = React.useContext(AppStateContext)
  const dispatch = React.useContext(AppDispatchContext)
  const classes = useStyles()

  const handleChange = (event) => {
    dispatch({
      type: TYPES.SET_BASE_CURRENCY,
      baseCurrency: event.target.value,
    })
    socket.current.emit("change base", event.target.value)
  }
  return (
    <FormControl variant="outlined" className={classes.formControl}>
      <InputLabel id="demo-simple-select-outlined-label">Base</InputLabel>
      <Select
        labelId="demo-simple-select-outlined-label"
        id="demo-simple-select-outlined"
        value={state.baseCurrency}
        onChange={handleChange}
        label="Age"
      >
        <MenuItem value="usd">USD</MenuItem>
        <MenuItem value="eur">EUR</MenuItem>
        <MenuItem value="jpy">JPY</MenuItem>
        <MenuItem value="btc">BTC</MenuItem>
      </Select>
    </FormControl>
  )
}

export default BaseCurrencySelect
