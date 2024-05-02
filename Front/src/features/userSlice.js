import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// const getLocalStorage = () => {
//   let isConnected = localStorage.getItem("isConnected");
//   console.log("isConnected, ", isConnected);
//   if (isConnected) {
//     return JSON.parse(isConnected);
//   } else {
//     return null;
//   }
// };

// const checkAuth = () => {
//     return sessionStorage.getItem("jwt_token") ? true : false;
//   };
const getSessionStorage = () => {
  let isConnected = sessionStorage.getItem("isConnected");
  let user = sessionStorage.getItem("user");

  console.log("isConnected: ", isConnected);
  console.log("user: ", user);

  if (isConnected) {
    return {
      isConnected: JSON.parse(isConnected),
      user: user ? JSON.parse(user) : null,
    };
  } else {
    return {
      isConnected: null,
      user: null,
    };
  }
};

export const login = createAsyncThunk(
  "user/login",
  async ({ email, password }) => {
    console.log("login slice", email, password);
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const user = await response.json();
      console.log("login success", user);
      return user;
    } else {
      const errDetails = await response.json();
      console.log("login error ", errDetails.error);
      return errDetails;
    }
  }
);

export const register = createAsyncThunk(
    "user/register",
    async ({ email, password, role }) => {
      console.log("register slice", email, password, role);
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // credentials: "include",
        body: JSON.stringify({ email, password, role }),
      });
  
      if (response.ok) {
        const user = await response.json();
        console.log("register success", user);
        return user;
      } else {
        const errDetails = await response.json();
        console.log("register error ", errDetails.error);
        return errDetails;
      }
    }
  );

const getUserInfo = createAsyncThunk("user/getUserInfo", async () => {
  const response = await fetch("/api/sessions/current", {
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user; // an object with the error coming from the server
  }
});

export const logout = createAsyncThunk("user/logout", async () => {
  const response = await fetch("http://localhost:3000/api/logout", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return null;
  }
});

const { isConnected, user } = getSessionStorage();

const initialState = {
  isConnected,
  user: user || null,
  loading: false,
  error: false,
  custom_error: null,

};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        // console.log('action.payload fullfiled ', action.payload)
        const { user, error } = action.payload;

        if (user) {
          sessionStorage.setItem("isConnected", JSON.stringify(true));
          sessionStorage.setItem("user", JSON.stringify(user));
          state.user = user;

          state.isConnected = true;
          state.custom_error = null;
        }
        if (error) {
          state.custom_error = error;
          console.error(error);
        }
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        // console.log('action.payload', action.payload)
        state.loading = false;
        // state.cutsom_error = 'h';
        // throw new Error(action.payload.message);
        state.error = true;
      })
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })

      .addCase(getUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.custom_error = action.payload;
      })

      .addCase(logout.pending, (state) => {
        state.loading = true;
      })

      .addCase(logout.fulfilled, (state) => {
        sessionStorage.removeItem("isConnected");
        sessionStorage.removeItem("user");
        state.custom_error = null;

        state.loading = false;
        state.user = null;
        state.isConnected = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(register.pending, (state) => {
        state.loading = true
      })

      .addCase(register.fulfilled, (state, action) => {

        state.loading = false

        const {user, errors} = action.payload

        if(user){
            alert(user.role + ' created')
        }
        if(errors){
            // state.error
            console.log('validation errors ', errors)
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = true
      })
      ;
  },
});

export const {} = userSlice.actions;
export default userSlice.reducer;
