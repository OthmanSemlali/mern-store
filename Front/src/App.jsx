// import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Error, Nav, Sidebar } from "./Components";
import { AboutPage, HomePage } from "./Pages";
import Footer from "./Components/Footer";

function App() {
  return (
    <Router>
      <Nav />
      <Sidebar />
      <Routes>
        <Route exact index element={<HomePage />} />
        <Route exact path="about" element={<AboutPage />} />
        <Route exact path="products/:slug" element={"single product page"} />
        <Route exact path="products" element={"products"} />
        {/* 
        <Route exact path="cart" element={<Cart />} />
        
        } />
        <Route exact path="checkout" element={<Checkout />} />
         */}
         <Route  path="*" element={<Error status={404} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
