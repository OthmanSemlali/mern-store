import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, countCartTotals } from "../features/cartSlice";
import { FaCartPlus } from "react-icons/fa";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const Button = styled.button`
width:140px;
  position: relative;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background-color: #218838;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => (show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
`;

const Loader = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const CartIcon = styled(FaCartPlus)`
  font-size: 20px;
  animation: ${({ show }) => (show ? fadeIn : "none")} 0.5s forwards;
`;
function AddToCartBtn({ id, optionColor, amount, product }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addProductToCart = async () => {
 

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        dispatch(addToCart({ id, optionColor, amount, product }));
        dispatch(countCartTotals());
      }, 400);
    }, 500);

 
  };

  return (
    <Button onClick={addProductToCart} disabled={loading || addedToCart}>
      {!loading && !addedToCart && "Add to Cart"}
      {/* Add to Cart */}
      <Overlay show={loading || addedToCart}>
        {loading && <Loader />}
        {addedToCart && <CartIcon show={true} />}
      </Overlay>
    </Button>
  );
}

export default AddToCartBtn;
