import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSideBarOpen: false,
    productsView:'list'
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
    setListView: (state) => {

        state.productsView = 'list'
    },
    setGridView: (state) => {
        state.productsView = 'grid'
    }
   
  },
});

export const { openSideBar, closeSideBar, setListView, setGridView } = themeSlice.actions;
export default themeSlice.reducer;
