import React from "react";
import PropTypes from "prop-types";

export const OrderContext = React.createContext(null);
// MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {

    case 'LOAD_ORDERS_BEGIN':
      return {
        ...state,
        isLoading:true,
        error:false,
      }

    case 'LOAD_ORDERS_SUCCESS':

    console.log('action.value', action.value)
    const {orders, totalOrders} = action.value
    console.log('orders context', orders)
      return {
        ...state,
        orders,
        totalOrders,
        isLoading:false,

      }
    
    case 'LOAD_ORDERS_ERROR':
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

export function OrderContextProvider({ children }) {

  const initialState = {
    orders: [],
    totalOrders:0,
    isLoading: false,
    error: null,
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(
    () => [state, dispatch],
    [state, dispatch]
  );

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrderContext() {
  const context = React.useContext(OrderContext);

  if (!context) {
    throw new Error(
      "useOrderContext should be used inside the OrderContext."
    );
  }

  return context;
}

// useProductContext.displayName = "/src/context/productContext.jsx";

OrderContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const loadOrdersBegin = (dispatch) => {
  dispatch({type: "LOAD_ORDERS_BEGIN"})
}
export const loadOrdersSuccess =  (dispatch, value) => {
  dispatch({ type: "LOAD_ORDERS_SUCCESS", value });
}
export const loadOrdersServerError = (dispatch) => {
  dispatch({type: 'LOAD_ORDERS_ERROR'})
}

export const updateOrderStatusBegin = (dispatch) => {
  dispatch({type: "UPDATE_ORDER_STTAUS_BEGIN"})
}
export const updateOrderStatusSuccess =  (dispatch, value) => {
  dispatch({ type: "UPDATE_ORDER_STATUS_SUCCESS", value });
}
export const updateOrderStatusError = (dispatch) => {
  dispatch({type: 'UPDATE_ORDER_STATUS_ERROR'})
}

// STATS