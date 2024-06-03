import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart, countCartTotals } from "../features/cartSlice";
// import { useCartContext } from "../context/cart_context";
// import { ScaleLoader } from "react-spinners";
function AddToCartBtn({ id, optionColor, amount, product }) {
  console.log("cart ", id, optionColor, amount, product);
  const dispatch = useDispatch();
  //   const { addToCart,cart_loader,cart_alert,cart_alert_type } = useCartContext();
  const { cart } = useSelector((store) => store.cart);
  //   const { selected_option_with_images } = useSelector((store) => store.product);

  //   const {color} = selected_option_with_images
  useEffect(() => {
    console.log("--localstorage--");
    localStorage.setItem("cart", JSON.stringify(cart));
    // console.log("caaart",state.cart);
  }, [cart]);

  const addProductToCart = () => {
    dispatch(addToCart({ id, optionColor, amount, product }));
    // dispatch(countCartTotals())
    dispatch(countCartTotals());
  };
  return (
    <button
      //   to="/cart"
      className="btn"
      //   onClick={()=> addToCart(id, mainColor, amount, product)}
      onClick={addProductToCart}
    >
      {/* {cart_loader ? "Loading..." : "add to cart"} */}
      add to cart
      {/* {cart_alert === "added" ? "ad" : null} */}
    </button>
  );
}

export default AddToCartBtn;
