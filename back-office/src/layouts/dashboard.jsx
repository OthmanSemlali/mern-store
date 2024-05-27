import { Routes, Route, useNavigate } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, useChartContext, fetchCardsData, fetchChartsData } from "@/context";
import { NotFound } from "@/pages/Error";
import { useEffect, useState } from "react";
import { Categories, Customers, Home, Orders, Tables } from "@/pages/dashboard";
import { AddProduct, EditProduct } from "@/components";
import axios from "axios";

export function Dashboard() {
  console.log('--dashboard--');
  const [controller, dispatch] = useMaterialTailwindController();
  const [dashState, dashDispatch] = useChartContext()
  const { sidenavType } = controller;

  
     
     

  useEffect(() => {

    
    
    fetchCardsData(dashDispatch)
    fetchChartsData(dashDispatch)

    console.log('eeeeeYY');
  },[])

  const navigate = useNavigate();

  
  const setFilter = (name, value) => {
   
    const params = new URLSearchParams(window.location.search);
    params.set('page', 1);
    
    // Set the filter value if it's not empty
    if (value.trim() !== "") {
      params.set(name, value);
    } else {
      // If the value is empty, remove the filter from the query string
      params.delete(name);
    }
    
    const newParamsString = params.toString();
    const newUrl = `${window.location.pathname}${newParamsString ? '?' + newParamsString : ''}`;
    
    navigate(newUrl);

  };




  return (
    <div className="min-h-screen bg-blue-gray-50/50">

      <Sidenav
        routes={routes}
        brandName="ZELIJ Hub"
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <Routes>

          <Route exact path="/home" element={<Home dashState={dashState} />} />
          <Route exact path="/products" element={<Tables setFilter={setFilter} />} />
          <Route exact path="/products/:id/edit" element={<EditProduct   />}  />
          <Route exact path="/products/add" element={<AddProduct />}  />
          <Route exact path="/categories" element={<Categories/>} />
          <Route exact path="/customers" element={<Customers/>} />
          <Route exact path="/orders" element={<Orders/>} />
          {/* {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )} */}
        </Routes>
        <div className="text-blue-gray-600">
          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
