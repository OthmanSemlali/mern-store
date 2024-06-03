import React from "react";
import PropTypes from "prop-types";

export const ChartContext = React.createContext(null);
// MaterialTailwind.displayName = "MaterialTailwindContext";

export function reducer(state, action) {
  switch (action.type) {
    case "LOAD_CARD_TODAYS_REVENUE":
      return {
        ...state,
        todays_revenue: {
          ...state.todays_revenue,
          isLoading: true,
        },
      };

    case "LOAD_CARD_TODAYS_REVENUE_SUCCESS":
      const { todayRevenue, comparison } = action.value;
      // console.log('ff ', todayRevenue, comparison)
      return {
        ...state,
        todays_revenue: {
          ...state.todays_revenue,
          revenue: todayRevenue,
          isLoading: false,
          comparison,
        },
      };

    case "LOAD_CARD_TODAYS_ORDERS":
      return {
        ...state,
        todays_orders: {
          ...state.todays_revenue,
          isLoading: true,
        },
      };
    case "LOAD_CARD_TODAYS_ORDERS_SUCCESS":
      const { todayOrderCount } = action.value;
      return {
        ...state,
        todays_orders: {
          ...state.todays_orders,
          orders: todayOrderCount,
          comparison: action.value.comparison,
          isLoading: false,

        },
      };

    case "LOAD_CARD_WEEK_USERS":
      return {
        ...state,
        week_users: {
          ...state.todays_revenue,
          isLoading: true,
        },
      };
    case "LOAD_CARD_WEEK_USERS_SUCCESS":
      return {
        ...state,
        week_users: {
          ...state.week_users,
          users: action.value.thisWeekUserCount,
          comparison: action.value.comparison,
          isLoading: false,

        },
      };

    case "LOAD_CARD_TOTAL_REVENUE":
      return {
        ...state,
        total_revenue: {
          ...state.todays_revenue,
          isLoading: true,
        },
      };
    case "LOAD_CARD_TOTAL_REVENUE_SUCCESS":
      return {
        ...state,
        total_revenue: {
          ...state.total_revenue,
          currentYearRevenue: action.value.currentYearRevenue,
          lastYearRevenue: action.value.lastYearRevenue,
          comparison: action.value.comparison,
          isLoading: false,

        },
      };

    case "LOAD_CHART_ORDERS_BY_MONTH_SUCCESS":
      console.log("orders data", action.value);
      return {
        ...state,
        ordersByMonths: {
          ...state.ordersByMonths,
          orders: action.value.ordersByMonth,
          months: action.value.months,
        },
      };

    case "LOAD_CHART_SALES_BY_MONTH_SUCCESS":
      console.log("ffff ", action.payload);
      return {
        ...state,
        salesByMonths: {
          ...state.salesByMonths,
          sales: action.value.salesByMonth,
          months: action.value.months,
        },
      };

    case "LOAD_CHART_USERS_BY_SUCCESS":
      return {
        ...state,
        usersByDays: {
          ...state.usersByDays,
          users: action.value.counts,
          days: action.value.days,
        },
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export function ChartContextProvider({ children }) {
  const initialState = {
    todays_revenue: {
      revenue: null,
      comparison: null,
      isLoading: false,
      error: false,
    },
    todays_orders: {
      orders: null,
      comparison: null,
      isLoading: false,
      error: false,
    },
    week_users: {
      users: null,
      comparison: null,
      isLoading: false,
      error: false,
    },
    total_revenue: {
      currentYearRevenue: null,
      lastYearRevenue: null,
      comparison: null,

      isLoading: false,
      error: false,
    },

    salesByMonths: {
      sales: [],
      months: [],
      isLoading: false,
      error: false,
    },
    ordersByMonths: {
      orders: [],
      months: [],
      isLoading: false,
      error: false,
    },
    usersByDays: {
      users: [],
      days: [],
      isLoading: false,
      error: false,
    },
  };

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = React.useMemo(() => [state, dispatch], [state, dispatch]);

  return (
    <ChartContext.Provider value={value}>{children}</ChartContext.Provider>
  );
}

export function useChartContext() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChartContext should be used inside the ChartContext.");
  }

  return context;
}

// useProductContext.displayName = "/src/context/productContext.jsx";

ChartContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const loadCardTodaysRevenue = (dispatch) => {
  dispatch({ type: "LOAD_CARD_TODAYS_REVENUE" });
};
export const loadCardTodaysOrders = (dispatch) => {
  dispatch({ type: "LOAD_CARD_TODAYS_ORDERS" });
};export const loadCardWeekUsers = (dispatch) => {
  dispatch({ type: "LOAD_CARD_WEEK_USERS" });
};export const loadCardTotalRevenue = (dispatch) => {
  dispatch({ type: "LOAD_CARD_TOTAL_REVENUE" });
};
export const loadCardTodaysRevenueSuccess = (dispatch, value) => {
  dispatch({ type: "LOAD_CARD_TODAYS_REVENUE_SUCCESS", value });
};
// export const loadCardTodaysRevenueError = (dispatch) => {
//   dispatch({type: 'LOAD_CARD_TODAYS_REVENUE_ERROR'})
// }

export const loadCardTodaysOrdersSuccess = (dispatch, value) => {
  dispatch({ type: "LOAD_CARD_TODAYS_ORDERS_SUCCESS", value });
};

export const loadCardWeekUsersSuccess = (dispatch, value) => {
  dispatch({ type: "LOAD_CARD_WEEK_USERS_SUCCESS", value });
};

export const loadCardTotalRevenueSuccess = (dispatch, value) => {
  dispatch({ type: "LOAD_CARD_TOTAL_REVENUE_SUCCESS", value });
};
// STATS

export const loadChartSalesByMonth = (dispatch, value) => {
  dispatch({ type: "LOAD_CHART_SALES_BY_MONTH_SUCCESS", value });
};

export const loadChartOrdersByMonth = (dispatch, value) => {
  console.log("value ", value);
  dispatch({ type: "LOAD_CHART_ORDERS_BY_MONTH_SUCCESS", value });
};

export const loadChartUsersByDay = (dispatch, value) => {
  dispatch({ type: "LOAD_CHART_USERS_BY_SUCCESS", value });
};
