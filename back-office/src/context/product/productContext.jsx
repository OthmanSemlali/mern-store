import React from "react";
import PropTypes from "prop-types";

export const ProductContext = React.createContext(null);
// MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
    
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function ProductContextProvider({ children }) {

  const initialState = {
    products: [],
    isLoading: false,
    error: null,
    singleProduct: {},
    singleProductIsLoading: false,
    singleProductError: null,
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [state, dispatch],
    [state, dispatch]
  );

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = React.useContext(ProductContext);

  if (!context) {
    throw new Error(
      "useProductContext should be used inside the ProductContext."
    );
  }

  return context;
}

// useProductContext.displayName = "/src/context/productContext.jsx";

ProductContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const loadProductsBegin = (dispatch) => {
  dispatch({type: "LOAD_PRODUCTS_BEGIN"})
}
export const loadProductsSuccess =  (dispatch, value) => {
  dispatch({ type: "LOAD_PRODUCTS_SUCCESS", value });
}
export const loadProductServerError = (dispatch) => {
  dispatch({type: 'LOAD_PRODUCTS_SERVER_ERROR'})
}

// STATS