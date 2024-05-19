import { loadUsersBegin, loadUsersError, loadUsersSuccess } from "./customerContext";

export const fetchUsersService = async (dispatch, page = 1, filters) => {
  
    loadUsersBegin(dispatch)
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          pageSize: 6,
          ...filters,
        }).toString();
  
        // console.log('order queryParams**', queryParams);
        const response = await fetch(
          `http://localhost:3000/api/users?${queryParams}`
        );
  
        if (!response.ok) {
        //   throw new Error("Failed to fetch users");
            loadUsersError(dispatch)
            console.log('still running')
        }
  
        const data = await response.json();
        console.log('users success ', data)

        loadUsersSuccess(dispatch, data.response)
        
      } catch (error) {
        console.log("Error: Something went wrong while fetching users", error);
        loadUsersError(dispatch)

      }
    }
