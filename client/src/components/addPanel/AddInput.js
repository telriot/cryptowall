import React, { useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { CircularProgress, TextField } from "@material-ui/core";
import {
  useAddPanelState,
  useAddPanelDispatch,
} from "../../contexts/addPanelContext";
import useDebounce from "../../hooks/useDebounce";
import axios from "axios";

const AUTOCOMPLETE_URL = "api/coins/autocomplete/";
export const fetchCoinNames = async (input) => {
  try {
    const response = await axios.get(AUTOCOMPLETE_URL, { params: { input } });
    const coins = response.data;
    return coins;
  } catch (error) {
    console.log(error);
    return [];
  }
};

function AddInput() {
  const { options, loading, input, selection } = useAddPanelState();
  const dispatch = useAddPanelDispatch();
  const inputField = React.useRef();
  const [open, setOpen] = React.useState(false);
  const debouncedInput = useDebounce(input, 300);
  //This is to fix the issues MUI Autocomplete has with async option lists
  const [selectionPlaceholder, setSelectionPlaceholder] = React.useState({
    code: "test",
    id: "test",
    name: "test",
  });

  useEffect(() => {
    const getCoinNames = async (input) => {
      dispatch({ type: "SET_LOADING", loading: true });
      try {
        const coins = await fetchCoinNames(input);
        dispatch({
          type: "SET_OPTIONS",
          options: coins.map((coin) => ({
            id: coin.id,
            name: coin.name,
            code: coin.symbol,
          })),
        });
        dispatch({ type: "SET_LOADING", loading: false });
      } catch (error) {
        dispatch({ type: "SET_LOADING", loading: false });
        console.log(error);
      }
    };
    debouncedInput.length < 2
      ? dispatch({ type: "SET_OPTIONS", options: [] })
      : getCoinNames(debouncedInput);
  }, [debouncedInput, dispatch]);

  useEffect(() => {
    if (!open && !selection) {
      dispatch({ type: "SET_OPTIONS", options: [] });
      dispatch({ type: "SET_INPUT", input: "" });
    }
  }, [open, dispatch, selection]);

  const handleChange = (e, input) => {
    dispatch({
      type: "SET_INPUT",
      input,
    });
  };
  const handleAutocompleteChange = (e, value) => {
    dispatch({
      type: "SET_SELECTION",
      selection: value,
    });
    if (!selection)
      dispatch({
        type: "SET_INPUT",
        input: "",
      });
    if (value) {
      setSelectionPlaceholder(value);
    }
  };

  const placeholderFilter = (options) =>
    options.filter((option) => {
      return selectionPlaceholder.name === selection && selection.name
        ? true
        : option.name !== selectionPlaceholder.name;
    });

  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      //disablePortal={true}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={selection}
      filterOptions={(options) => placeholderFilter(options)}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      onChange={(e, value) => handleAutocompleteChange(e, value)}
      inputValue={input}
      onInputChange={(e, input) => handleChange(e, input)}
      options={[...options, selectionPlaceholder]}
      loading={loading}
      renderInput={(params) => (
        <TextField
          inputRef={inputField}
          {...params}
          label="Coin Name"
          variant="outlined"
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
  );
}

export default AddInput;
