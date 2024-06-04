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
export const fetchPaginatedProducts = createAsyncThunk(
  "products/getPaginatedProducts",  
  async ({ page = 1, filters }, thunkAPI) => {
    console.log('page', page);

    console.log('filters***************', filters)
    try {
      
      // console.log('fetch****');return
      // Construct query parameters for pagination and filtering
      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: 6,
        ...filters,
        reqFromFrontStore:true
      }).toString();

      console.log('queryParams***********************', queryParams);
      const response = await fetch(
        `http://localhost:3000/api/products?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      return data; // Returning data on success
    } catch (error) {
      console.log("Error: Something went wrong while fetching products", error);
      return thunkAPI.rejectWithValue(
        "Something went wrong while fetching products"
      );
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (slug, thunkAPI) => {

    try {
  
       
      const res = await axios(
        `${"http://localhost:3000"}/api/products/fetchSingleProductBySlug/${slug}`
      );



      // console.log('res.data', res.data)
      return res.data;
    } catch (error) {
      console.log("err: something went wrong while fetching pr");
      return thunkAPI.rejectWithValue(
        "something went wrong while fetching pr"
      );
    }
  }
);

// const fetchPaginatedProducts = createAsyncThunk(
//     "products/getPaginatedProducts",
//     async ({ page, pageSize }, thunkAPI) => {
//       try {
//         const response = await fetch(
//           `http://localhost:3000/fetchPaginatedProducts/${page}/${pageSize}`
//         );
//         if (!response.ok) {
//           throw new Error('Failed to fetch posts');
//         }
//         const data = await response.json();
//         return data; // Returning data on success
//       } catch (error) {
//         console.log("err: something went wrong while fetching products");
//         return thunkAPI.rejectWithValue(
//           "something went wrong while fetching products"
//         );
//       }
//     }
//   );

const initialState = {
  products: [],
  products_loading: false,
  products_error: false,

  totalProducts: 0,
  // totalPages: 0,

  featured_products: [],
  featured_products_status: "success",

  single_product: {},
  single_product_loading: false,
  single_product_error: false,

  selected_option_images:[],

  sort:'price-lowest'
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    
    setOptions: (state, action) => {
      state.selected_option_images = action.payload
  },

  updateSort: (state, action) => {
    state.sort = action.payload

    console.log("updated sort", state.sort);
  },

  sortProducts: (state) => {

    console.log('state.products*****************', state.products)
    let tempProducts = [...state.products];
    const {sort} = state
    console.log('sort ', sort)

    if (sort === "price-lowest") {
      // console.log('price-lowest')
      tempProducts = tempProducts.sort((a, b) => a.price - b.price);

      console.log('tempProducts ', tempProducts )
    }
    if (sort === "price-highest") {
      tempProducts = tempProducts.sort((a, b) => b.price - a.price);
    }
    if (sort === "name-a") {
      tempProducts = tempProducts.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
    }
    if (sort === "name-z") {
      tempProducts = tempProducts.sort((a, b) => {
        return b.name.localeCompare(a.name);
      });
    }

    return {
      ...state,
      products:tempProducts
    }
  }
  },
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
      })

      .addCase(fetchPaginatedProducts.pending, (state) => {
        state.products_loading = true;
      })

      .addCase(fetchPaginatedProducts.fulfilled, (state, action) => {
        console.log(action.payload.response)
        state.products = action.payload.response.products;
        state.totalProducts = action.payload.response.totalProducts;
        // state.totalPages = action.payload.response.totalProducts / 6
    
        state.products_loading = false;
      })
      .addCase(fetchPaginatedProducts.rejected, (state) => {
        state.products_error = true;
      })
      
      .addCase(fetchProduct.pending, (state)=>{
        state.single_product_loading = true
      })
      .addCase(fetchProduct.fulfilled, (state, action)=>{
        state.single_product_loading = false
        state.single_product = action.payload
        state.selected_option_images = action.payload.options[0].images
      })
      .addCase(fetchProduct.rejected, (state)=>{
        state.single_product_error = true
      });
  },
});

export const {setOptions, updateSort, sortProducts} = productSlice.actions;
export default productSlice.reducer;
