import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./features/productSlice";
import themeSlice from "./features/themeSlice";
import filterSlice from "./features/filterSlice";
import cartSlice from "./features/cartSlice";


export const store = configureStore({

    reducer:{
        product:productSlice,
        theme:themeSlice,
        filter:filterSlice,
        cart:cartSlice
    }
})