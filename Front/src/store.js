import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./features/productSlice";
import themeSlice from "./features/themeSlice";


export const store = configureStore({

    reducer:{
        product:productSlice,
        theme:themeSlice
    }
})