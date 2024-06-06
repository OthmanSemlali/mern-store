import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isSideBarOpen: false,
    productsView:'list',
    isFilterModalOpen:false,

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

    openFilterModal: (state) => {
      state.isFilterModalOpen = true;
    },
    closeFilterModal:(state)=>{
        state.isFilterModalOpen = false
    },
    setListView: (state) => {

        state.productsView = 'list'
    },
    setGridView: (state) => {
        state.productsView = 'grid'
    }
   
  },
});

export const { openSideBar, closeSideBar, setListView, setGridView, openFilterModal, closeFilterModal } = themeSlice.actions;
export default themeSlice.reducer;
