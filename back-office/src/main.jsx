import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthenticationContextProvider, CustomerContextProvider, MaterialTailwindControllerProvider, OrderContextProvider, ProductContextProvider } from "@/context";
import "../public/css/tailwind.css";
import { ChartContextProvider } from "./context/dash/dashContext";
import { ToastContainer } from "react-toastify";

import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthenticationContextProvider>

      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <ProductContextProvider>
            <OrderContextProvider>
              <CustomerContextProvider>
                <ChartContextProvider>

                  <App />
                </ChartContextProvider>

              </CustomerContextProvider>
            </OrderContextProvider>
          </ProductContextProvider>
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </AuthenticationContextProvider>


    <ToastContainer position='top-left' autoClose={3000} />
    </BrowserRouter>
  </React.StrictMode>
);