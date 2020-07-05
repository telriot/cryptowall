import React, { useEffect, useRef } from "react"
import { TYPES } from "./types"
import socketIOClient from "socket.io-client"
import axios from "axios"

const ACTIVE_COINS_API = "/api/coins"
const initialState = {
  data: [],
}

const SocketStateContext = React.createContext()
const SocketDispatchContext = React.createContext()

const SocketProvider = ({ children }) => {
  let socket = useRef()
  const socketReducer = (state, action) => {
    switch (action.type) {
      case TYPES.SET_ACTIVE_COINS_DATA:
        return {
          ...state,
          data: action.data,
        }

      default:
        return state
    }
  }
  const [socketState, socketDispatch] = React.useReducer(
    socketReducer,
    initialState
  )
  const getInitialData = async () => {
    try {
      const results = await axios.get(ACTIVE_COINS_API)
      socketDispatch({
        type: TYPES.SET_ACTIVE_COINS_DATA,
        data: results.data.coins,
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getInitialData()
    socket.current = socketIOClient("/")
    socket.current.on("FromAPI", (data) => {
      socketDispatch({ type: TYPES.SET_ACTIVE_COINS_DATA, data: data.coins })
    })
    return () => socket.current.disconnect()
  }, [])

  return (
    <SocketStateContext.Provider value={{ socketState, socket }}>
      <SocketDispatchContext.Provider value={socketDispatch}>
        {children}
      </SocketDispatchContext.Provider>
    </SocketStateContext.Provider>
  )
}

function useSocketState() {
  const context = React.useContext(SocketStateContext)
  if (context === undefined) {
    throw new Error("useSocketState must be used within a SocketProvider")
  }
  return context
}
function useSocketDispatch() {
  const context = React.useContext(SocketDispatchContext)
  if (context === undefined) {
    throw new Error("useSocketDispatch must be used within a SocketProvider")
  }
  return context
}

export {
  SocketStateContext,
  SocketDispatchContext,
  SocketProvider,
  useSocketState,
  useSocketDispatch,
}
