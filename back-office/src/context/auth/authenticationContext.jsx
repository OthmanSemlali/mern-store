import React from "react";
import PropTypes from "prop-types";
import { getAuthenticatedFromStorage, getUserFromStorage } from "./authenticationServices";

export const AuthenticationContext = React.createContext(null);
// MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
  
    case 'SET_AUTH':
   
      return {...state, isLoading:false, authenticated: true, error:null, user: action.value};

    case 'CLEAR_AUTH':
      return {...state, authenticated: false, user:null}

    case 'AUTH_REQ_BEGIN':
      return {...state, error:null, isLoading:true}

    case 'AUTH_END':
      return {...state, isLoading: false, error:null}

    case 'SET_AUTH_ERROR':
      return {...state, isLoading: false, error:action.value}
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function AuthenticationContextProvider({ children }) {

  const initialState = {
    authenticated: getAuthenticatedFromStorage() || false,
    user: getUserFromStorage(),
    isLoading: false,
    error:null
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [state, dispatch],
    [state, dispatch]
  );

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
}

export function useAuthenticationContext() {
  const context = React.useContext(AuthenticationContext);

  if (!context) {
    throw new Error(
      "useAuthenticationContext should be used inside the AuthenticationContext."
    );
  }

  return context;
}

useAuthenticationContext.displayName = "/src/context/authenticationContext.jsx";

AuthenticationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export const clearAuth = (dispatch) =>
  dispatch({ type: "CLEAR_AUTH" });

export const authReqBegin = (dispatch) => {
  dispatch({type: "AUTH_REQ_BEGIN"})
}
export const setAuth =  (dispatch, value) => {
  console.log("setauth : ", value);
  dispatch({ type: "SET_AUTH", value });
}
export const authEnd = (dispatch) => {
  dispatch({type:"AUTH_END"})
}

export const authError = (dispatch, value) => {
  dispatch({type: 'SET_AUTH_ERROR', value})
}