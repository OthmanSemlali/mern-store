import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSideBarOpen: false,
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    openSideBar: (state) => {
      state.isSideBarOpen = true;
    },
    closeSideBar:(state)=>{
        state.isSideBarOpen = false
    },
   
  },
});

export const { openSideBar, closeSideBar } = themeSlice.actions;
export default themeSlice.reducer;
