import React, { useState, useEffect } from "react"
import { Autocomplete } from "@material-ui/lab"
import { CircularProgress, TextField } from "@material-ui/core"
import axios from "axios"
import useDebounce from "../../hooks/useDebounce"
import {
  AddPanelStateContext,
  AddPanelDispatchContext,
} from "../../contexts/addPanelContext"
const AUTOCOMPLETE_URL = "api/coins/autocomplete/"

function AddInput() {
  const { options, loading, input, selection } = React.useContext(
    AddPanelStateContext
  )
  const dispatch = React.useContext(AddPanelDispatchContext)
  const inputField = React.useRef()
  const [open, setOpen] = useState(false)
  const debouncedInput = useDebounce(input, 300)

  const getCoinNames = async (input) => {
    dispatch({ type: "SET_LOADING", loading: true })
    try {
      const response = await axios.get(AUTOCOMPLETE_URL, { params: { input } })
      const coins = response.data

      dispatch({
        type: "SET_OPTIONS",
        options: coins.map((coin) => ({
          id: coin.id,
          name: coin.name,
          code: coin.symbol,
        })),
      })
      dispatch({ type: "SET_LOADING", loading: false })
    } catch (error) {
      dispatch({ type: "SET_LOADING", loading: false })
      console.log(error)
    }
  }

  useEffect(() => {
    debouncedInput.length < 2
      ? dispatch({ type: "SET_OPTIONS", options: [] })
      : getCoinNames(debouncedInput)
  }, [debouncedInput])

  useEffect(() => {
    if (!open) {
      dispatch({ type: "SET_OPTIONS", options: [] })
      dispatch({ type: "SET_INPUT", input: "" })
    }
  }, [open])

  const handleChange = (e) => {
    dispatch({
      type: "SET_INPUT",
      input: e.target.value,
    })
  }
  const handleAutocompleteChange = (e, value) => {
    dispatch({
      type: "SET_SELECTION",
      selection: value,
    })
  }

  return (
    <Autocomplete
      id="asynchronous-demo"
      style={{ width: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      value={selection}
      data-testid="autocomplete"
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      onChange={(e, value) => handleAutocompleteChange(e, value)}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          inputRef={inputField}
          {...params}
          label="Coin Name"
          variant="outlined"
          onChange={handleChange}
          value={input}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  )
}

export default AddInput
