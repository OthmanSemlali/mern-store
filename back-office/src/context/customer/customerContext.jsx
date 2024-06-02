import React from "react";
import PropTypes from "prop-types";

export const CustomerContext = React.createContext(null);
// MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {

    case 'LOAD_USERS_BEGIN':
      return {
        ...state,
        isLoading:true,
        error:false,
      }

    case 'LOAD_USERS_SUCCESS':

    console.log('action.valuekkkkk', action.value)
    const {users, totalUsers} = action.value
      return {
        ...state,
        users,
        totalUsers,
        isLoading:false,
      }
    
    case 'LOAD_USERS_ERROR':
      return {
        ...state,
        isLoading:false,
        error:true
      }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function CustomerContextProvider({ children }) {

  const initialState = {
    users: [],
    totalUsers:0,
    isLoading: false,
    error: null,
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [state, dispatch],
    [state, dispatch]
  );

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
}

export function useCustomerContext() {
  const context = React.useContext(CustomerContext);

  if (!context) {
    throw new Error(
      "useCustomerContext should be used inside the CustomerContext."
    );
  }

  return context;
}

// useProductContext.displayName = "/src/context/productContext.jsx";

CustomerContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const loadUsersBegin = (dispatch) => {
  dispatch({type: "LOAD_USERS_BEGIN"})
}
export const loadUsersSuccess =  (dispatch, value) => {
  dispatch({ type: "LOAD_USERS_SUCCESS", value });
}
export const loadUsersError = (dispatch) => {
  dispatch({type: 'LOAD_USERS_ERROR'})
}