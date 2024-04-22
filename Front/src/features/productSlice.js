// import { config as dotenvConfig } from "dotenv";

// if (process.env.NODE_ENV === "development") {
//   dotenvConfig();
// }
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getFeaturedProducts = createAsyncThunk(
  "products/getFeaturedProducts",
  async (param, thunkAPI) => {
    try {
      // console.log(name);
      // console.log(thunkAPI);
      // console.log(thunkAPI.getState());
      // thunkAPI.dispatch();
      const res = await axios(
        `${"http://localhost:3000"}/api/products/getFeaturedProducts`
      );

      return res.data;
    } catch (error) {
      console.log("err: something went wrong while fetching featured products");
      return thunkAPI.rejectWithValue(
        "something went wrong while fetching featured products"
      );
    }
  }
);

const initialState = {
  products: [],
  products_loading: false,
  products_error: false,

  featured_products: [],
  featured_products_status: "success",

  single_product: {},
  single_product_loading: false,
  single_product_error: false,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeaturedProducts.pending, (state) => {
        state.featured_products_status = "loading";
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.featured_products_status = "success";
        state.featured_products = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state) => {
        state.featured_products_status = "failed";
      });
  },
});

export const {} = productSlice.actions;
export default productSlice.reducer;
