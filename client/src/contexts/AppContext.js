import React, { useReducer, createContext, useEffect } from "react"
import { TYPES } from "./types"

const initialState = {
  displayedCoins: [],
}
const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()

const AppContextProvider = ({ children }) => {
  const appReducer = (state, action) => {
    switch (action.type) {
      case TYPES.SET_DISPLAYED_COINS:
        return {
          ...state,
          displayedCoins: action.coins,
        }
      case TYPES.ADD_DISPLAYED_COIN:
        return {
          ...state,
        }
      case TYPES.REMOVE_DISPLAYED_COIN:
        return {
          ...state,
        }
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppStateContext.Provider value={state}>
      <AppStateContext.Provider value={dispatch}>
        {children}
      </AppStateContext.Provider>
    </AppStateContext.Provider>
  )
}

export { AppStateContext, AppDispatchContext, AppContextProvider }
