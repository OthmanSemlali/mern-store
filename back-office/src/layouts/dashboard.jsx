import { Routes, Route } from "react-router-dom";
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
import { useEffect } from "react";
import { Categories, Customers, Home, Orders, Tables } from "@/pages/dashboard";

export function Dashboard() {
  console.log('dashboard');
  const [controller, dispatch] = useMaterialTailwindController();
  const [dashState, dashDispatch] = useChartContext()
  const { sidenavType } = controller;


  useEffect(() => {
    fetchCardsData(dashDispatch)
    fetchChartsData(dashDispatch)
  },[])

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
          <Route exact path="/products" element={<Tables />} />
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
