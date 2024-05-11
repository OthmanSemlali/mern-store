import React, { useEffect } from "react";
import { FaShoppingCart, FaUserMinus, FaUserPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { closeSideBar } from "../features/themeSlice";
import { countCartTotals } from "../features/cartSlice";
import { logout } from "../features/userSlice";
// import { useProductsContext } from "../context/products_context";
// import { useCartContext } from "../context/cart_context";
// import { useUserContext } from "../context/user_context";

const CartButtons = ({ closeSideBatHundler }) => {
  const dispatch = useDispatch();
  const { total_items } = useSelector((store) => store.cart);

  const { isConnected, user } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(countCartTotals());
  }, []);

  return (
    <Wrapper className="cart-btn-wrapper">
      <Link to="/cart" className="cart-btn" onClick={closeSideBatHundler}>
        Cart
        <span className="cart-container">
          <FaShoppingCart />
          <span className="cart-value">{total_items} </span>
        </span>
      </Link>

      {isConnected && user && user.role === "user" ? (
        <button className="auth-btn" onClick={() => dispatch(logout())}>logout</button>
      ) : (
        <Link to="/login" className="auth-btn" onClick={closeSideBatHundler}>
          Login
          <FaUserPlus />
        </Link>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  width: 225px;

  .cart-btn {
    color: var(--clr-grey-1);
    font-size: 1.5rem;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-1);
    display: flex;

    align-items: center;
  }
  .cart-container {
    display: flex;
    align-items: center;
    position: relative;
    svg {
      height: 1.6rem;
      margin-left: 5px;
    }
  }
  .cart-value {
    position: absolute;
    top: -10px;
    right: -16px;
    background: var(--clr-primary-5);
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: var(--clr-white);
    padding: 12px;
  }
  .auth-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border-color: transparent;
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }
`;
export default CartButtons;
