import { authEnd, authError, authReqBegin, clearAuth, setAuth } from "..";

export const getAuthenticatedFromStorage = () => {
    let authenticated = sessionStorage.getItem("authenticated");

    if(authenticated){
        return authenticated
    }else{
        return null
    }

}

export const getUserFromStorage = () => {
    let user = sessionStorage.getItem("user");

    if(user){
        return user
    }else{
        return null
    }

}

export const login = async ({ email, password }, dispatch, navigate) => {

    authReqBegin(dispatch)
     
      try {
        const response = await fetch("http://localhost:3000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });

          if (response.ok) {
            const {user, error} = await response.json();
            if(user){
                // console.log("login success", user);
                sessionStorage.setItem("authenticated", JSON.stringify(true));
                sessionStorage.setItem("user", JSON.stringify(user));
    
                setAuth(dispatch , user)
                navigate('/dashboard/home')
            }
            if(error){
                // console.log('validation ', error )
                authError(dispatch, error)

            }

            
          }
        //    else {
        //     const errDetails = await response.json();
        //     console.log("login : validation ", errDetails.error);
        //     authError(dispatch, error)

        //   }
      } catch (error) {
        console.error(' SERVER ERROR ')
        authEnd(dispatch)
      }

}


export const logout = async (dispatch) => {
    const response = await fetch("http://localhost:3000/api/logout", {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
        sessionStorage.removeItem("authenticated");
        sessionStorage.removeItem("user");


        clearAuth(dispatch)
      
    }
}