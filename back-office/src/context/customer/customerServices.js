import { toast } from "react-toastify";
import { loadUsersBegin, loadUsersError, loadUsersSuccess } from "./customerContext";

export const fetchUsersService = async (dispatch, page = 1, type, searchQuery) => {
  
    loadUsersBegin(dispatch)
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          pageSize: 6,
          searchQuery,
          type,
        }).toString();
  
        console.log('order queryParams**', queryParams);
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

        loadUsersSuccess(dispatch, data)
        
      } catch (error) {
        console.log("Error: Something went wrong while fetching users", error);
        loadUsersError(dispatch)
        toast.error('Something went wrong. Try later!')


      }
    }
