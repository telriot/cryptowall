import React from "react"
import { TYPES } from "./types"

const initialState = {
  input: "",
  selection: undefined,
  loading: false,
  options: [],
}

const AddPanelStateContext = React.createContext()
const AddPanelDispatchContext = React.createContext()

const AddPanelProvider = ({ children }) => {
  const addPanelReducer = (state, action) => {
    switch (action.type) {
      case TYPES.RESET_STATE:
        return { ...initialState }
      case TYPES.SET_INPUT:
        return {
          ...state,
          input: action.input,
        }
      case TYPES.SET_SELECTION:
        return {
          ...state,
          selection: action.selection,
        }
      case TYPES.SET_LOADING:
        return {
          ...state,
          loading: action.loading,
        }
      case TYPES.SET_OPTIONS:
        return {
          ...state,
          options: action.options,
        }
      default:
        return state
    }
  }
  const [addPanelState, addPanelDispatch] = React.useReducer(
    addPanelReducer,
    initialState
  )

  return (
    <AddPanelStateContext.Provider value={addPanelState}>
      <AddPanelDispatchContext.Provider value={addPanelDispatch}>
        {children}
      </AddPanelDispatchContext.Provider>
    </AddPanelStateContext.Provider>
  )
}
function useAddPanelState() {
  const context = React.useContext(AddPanelStateContext)
  if (context === undefined) {
    throw new Error("useAddPanelState must be used within a AddPanelProvider")
  }
  return context
}
function useAddPanelDispatch() {
  const context = React.useContext(AddPanelDispatchContext)
  if (context === undefined) {
    throw new Error(
      "useAddPanelDispatch must be used within a AddPanelProvider"
    )
  }
  return context
}

export default {
  AddPanelStateContext,
  AddPanelDispatchContext,
  AddPanelProvider,
  useAddPanelState,
  useAddPanelDispatch,
}
