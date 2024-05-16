import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { AuthenticationContextProvider, MaterialTailwindControllerProvider, OrderContextProvider, ProductContextProvider } from "@/context";
import "../public/css/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthenticationContextProvider>

      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <ProductContextProvider>
            <OrderContextProvider>
              <App />
            </OrderContextProvider>
          </ProductContextProvider>
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </AuthenticationContextProvider>

    </BrowserRouter>
  </React.StrictMode>
);