import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
// import { CartContent, PageHero } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { CartContent, PageHero } from "../Components";
import { countCartTotals } from "../features/cartSlice";

const CartPage = () => {
  const { cart } = useSelector((store)=>store.cart)
const dispatch = useDispatch()

  useEffect(() => {
    console.log("--localstorage cart--");
    localStorage.setItem("cart", JSON.stringify(cart));
    // console.log("caaart",state.cart);

    dispatch(countCartTotals())
  }, [cart]);

  console.log('CART', cart)
  if (cart.length < 1) {
    return (
      <Wrapper className="page-100">
        <div className="empty">
          <h2>Your cart is empty</h2>
          <Link to="/products" className="btn">
            fill it
          </Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <main>
      <PageHero title="cart" />
      <Wrapper className="page">
        <CartContent />
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.main`
  // margin-top:10px

  .empty {
    text-align: center;
    h2 {
      margin-bottom: 1rem;
      text-transform: none;
    }
  }
`;

export default CartPage;
