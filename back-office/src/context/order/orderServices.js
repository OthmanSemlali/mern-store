import { loadOrdersBegin, loadOrdersServerError, loadOrdersSuccess, updateOrderStatusBegin, updateOrderStatusError, updateOrderStatusSuccess,  } from "..";

 
export const fetchOrdersService = async (dispatch, page = 1, filters,  handelInput,handelStatus,handelDate) => {
  
  console.log('handleInput service ', handelInput)
  console.log('handleInput s ', handelStatus)
    loadOrdersBegin(dispatch)
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          pageSize: 6,
          firstName:handelInput,
          status : handelStatus,
          date : handelDate,
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

    
export const updateOrderStatus = async (dispatch,oldStatusId, newStatus) => {
  
    // updateOrderStatusBegin(dispatch)
      try {
            const response = await fetch(
          `http://localhost:3000/api/orders/updateOrderStatus/${oldStatusId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ newStatus}),
          }
        );
  
        if (!response.ok) {
            // throw new Error("Failed to fetch orders");
            // updateOrderStatusError(dispatch)
            console.log('update order errorr')
        }
  
        const data = await response.json();
        console.log('update order success')

        // updateOrderStatusSuccess(dispatch, data.response)
        
      } catch (error) {
        console.log("Error: Something went wrong while updating orders", error);
        // updateOrderStatusError(dispatch)
        console.log('update order error')

      }
    }