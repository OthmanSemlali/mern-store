import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getCategoriesWithProductsCounts = createAsyncThunk(
  "filters/getCategoriesWithProductsCounts",
  async (param, thunkAPI) => {
    console.log('getCategoriesWithProductsCounts');
    try {
      const res = await axios(
        `${"http://localhost:3000"}/api/products/getCategoriesWithProductsCounts`
      );

      return res.data;
    } catch (error) {
      console.log(
        "err: something went wrong while fetching categories with count"
      );
      return thunkAPI.rejectWithValue(
        "something went wrong while fetching categories with count"
      );
    }
  }
);

export const getDistinctFilters = createAsyncThunk(
  "filters/getDistinctFilters",
  async (param, thunkAPI) => {
    console.log('getDistinctFilters');
    try {
      const res = await axios(
        `${"http://localhost:3000"}/api/products/distinctFilters`
      );

      return res.data;
    } catch (error) {
      console.log(
        "err: something went wrong while fetching distinctProducts"
      );
      return thunkAPI.rejectWithValue(
        "something went wrong while fetching distinctProducts"
      );
    }
  }
);
const initialState = {
  distinctCategoriesWithPostsCount: [],
  styles: [],
  materials: [],
  tileUse: [],
  catLoading: false,
  filtersLoading: false,
  error: false,
};
const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategoriesWithProductsCounts.pending, (state) => {
        state.catLoading = true;
      })
      .addCase(getCategoriesWithProductsCounts.fulfilled, (state, action) => {
        state.catLoading = false;
        state.distinctCategoriesWithPostsCount = action.payload;
      })
      .addCase(getCategoriesWithProductsCounts.rejected, (state) => {
        state.catLoading = false;
        state.error = true;
      })
      
      .addCase(getDistinctFilters.pending, (state) => {
        state.filtersLoading = true;
      })
      .addCase(getDistinctFilters.fulfilled, (state, action) => {
        state.filtersLoading = false;
        state.styles = action.payload.styles;
        state.materials = action.payload.materials;
        state.tileUse = action.payload.tileUse;
      })
      .addCase(getDistinctFilters.rejected, (state) => {
        state.filtersLoading = false;
        state.error = true;
      });
  },
});

export const {} = filterSlice.actions;
export default filterSlice.reducer;
