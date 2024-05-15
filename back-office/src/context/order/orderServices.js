import { loadOrdersBegin, loadOrdersServerError, loadOrdersSuccess,  } from "..";


export const fetchOrdersService = async (dispatch, page = 1, filters) => {
  
    loadOrdersBegin(dispatch)
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          pageSize: 6,
          ...filters,
        }).toString();
  
        console.log('order queryParams**', queryParams);
        const response = await fetch(
          `http://localhost:3000/api/orders?${queryParams}`
        );
  
        if (!response.ok) {
        //   throw new Error("Failed to fetch orders");
            loadOrdersServerError(dispatch)
            console.log('still running')
        }
  
        const data = await response.json();

        loadOrdersSuccess(dispatch, data.response)
        
      } catch (error) {
        console.log("Error: Something went wrong while fetching orders", error);
        loadOrdersServerError(dispatch)
      }
    }