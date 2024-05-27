
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Error, Header, Nav, Sidebar } from "./Components";
import { AboutPage, CartPage, CheckoutPage, HomePage, Login, Product, Register,Profile } from "./Pages";
import Footer from "./Components/Footer";
import Products from "./Pages/Products";
import Protected from "./Components/protected";

function App() {
  return (
    <Router>
      <Header />
      <Nav />
      <Sidebar />
      <Routes>
        <Route exact index element={<HomePage />} />
        <Route exact path="about" element={<AboutPage />} />
        <Route exact path="products/:slug" element={<Product />} />
        <Route exact path="products" element={<Products />} />
        <Route exact path="cart" element={<CartPage />} />
        <Route
          exact
          path="checkout"
          element={
            <Protected>
              {" "}
              <CheckoutPage />{" "}
            </Protected>
          }
        />
        <Route exact path="login" element={<Login />} />
        <Route exact path="register" element={<Register />} />
        <Route exact path="profile" element={<Profile />} />

        <Route path="*" element={<Error status={404} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
