import React from "react";
import { TYPES } from "./types";

const initialState = {
  hiddenCoins: new Set(),
  range: 30,
  baseCurrency: "usd",
  isDark: false,
};
const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

const AppContextProvider = ({ children }) => {
  const appReducer = (state, action) => {
    switch (action.type) {
      case TYPES.TOGGLE_HIDE_COIN:
        const handleToggle = (set, coin) => {
          let newSet = new Set(set);
          set.has(coin) ? newSet.delete(coin) : newSet.add(coin);
          return newSet;
        };

        return {
          ...state,
          hiddenCoins: handleToggle(state.hiddenCoins, action.coin),
        };
      case TYPES.SET_RANGE:
        return {
          ...state,
          range: action.range,
        };
      case TYPES.SET_BASE_CURRENCY:
        return {
          ...state,
          baseCurrency: action.baseCurrency,
        };
      case TYPES.SET_THEME:
        return {
          ...state,
          isDark: !state.isDark,
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = React.useReducer(appReducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
function useAppState() {
  const context = React.useContext(AppStateContext);
  if (context === undefined) {
    throw new Error("useAppState must be used within a AppProvider");
  }
  return context;
}
function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (context === undefined) {
    throw new Error("useAppDispatch must be used within a AppProvider");
  }
  return context;
}
export {
  AppStateContext,
  AppDispatchContext,
  AppContextProvider,
  useAppState,
  useAppDispatch,
};
