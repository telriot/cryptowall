import React, { useReducer, createContext, useEffect } from "react"
import { TYPES } from "./types"

const initialState = {}
export const AppContext = createContext(initialState)

const AppContextProvider = ({ children }) => {
  const appReducer = (state, action) => {
    switch (action.type) {
      default:
        return state
    }
  }
  const [state, dispatch] = useReducer(appReducer, initialState)

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContextProvider
