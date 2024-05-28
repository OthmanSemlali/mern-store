import React, { useEffect } from "react";
import {
  FaShoppingCart,
  FaUserMinus,
  FaUserPlus,
  FaUser,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { closeSideBar } from "../features/themeSlice";
import { countCartTotals } from "../features/cartSlice";
import { logout } from "../features/userSlice";
// import { useProductsContext } from "../context/products_context";
// import { useCartContext } from "../context/cart_context";
// import { useUserContext } from "../context/user_context";

const CartButtons = ({ closeSideBatHundler }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { total_items } = useSelector((store) => store.cart);
  const { isConnected, user } = useSelector((store) => store.user);

  useEffect(() => {
    dispatch(countCartTotals());
  }, []);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Wrapper className="cart-btn-wrapper">
      <Link to="/cart" className="cart-btn" onClick={closeSideBatHundler}>
        Cart
        <span className="cart-container">
          <FaShoppingCart />
          <span className="cart-value">{total_items} </span>
        </span>
      </Link>

      {/* {isConnected && user && user.role === "user" ? (
        <button className="auth-btn" onClick={() => dispatch(logout())}>
          logout
        </button>
      ) : (
        <Link to="/login" className="auth-btn" onClick={closeSideBatHundler}>
          Login
          <FaUserPlus />
        </Link>
      )} */}
      {isConnected && user && user.role === "user" ? (
        <div className="dropdown">
          <button className="auth-btn">
            {user.firstName} <FaUser />
          </button>
          <div className="dropdown-content">
            <Link to="/profile" onClick={closeSideBatHundler}>
              Profile
            </Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <div className="dropdown">
          <button className="auth-btn">
            Welcome! <FaUserPlus />
          </button>
          <div className="dropdown-content">
            <Link to="/login" onClick={closeSideBatHundler}>
              Login
            </Link>
            <Link to="/Register" onClick={closeSideBatHundler}>
              Register
            </Link>
          </div>
        </div>
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
    font-size: 1rem;
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
    font-size: 1rem;
    cursor: pointer;
    color: var(--clr-grey-1);
    letter-spacing: var(--spacing);
    svg {
      margin-left: 5px;
    }
  }
  .dropdown {
    position: relative;
    display: inline-block;

    .dropdown-content {
      display: none;
      position: absolute;
      background-color: white;
      min-width: 160px;
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
      z-index: 1;
      a,
      button {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        width: 100%;
        text-align: left;
        border: none;
        background: none;
        cursor: pointer;
      }
      a:hover,
      button:hover {
        background-color: #f1f1f1;
      }
    }

    &:hover .dropdown-content {
      display: block;
    }
  }
`;
export default CartButtons;
