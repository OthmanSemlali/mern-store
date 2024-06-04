import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart, countCartTotals } from "../features/cartSlice";
import { FaCartPlus } from "react-icons/fa";
import { RiLoader4Line } from "react-icons/ri";
import styled, { css, keyframes } from "styled-components";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Button = styled.button`
  position: relative;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: ${({ added }) => (added ? "#28a745" : "#28a745")};
  color: ${({ added }) => (added ? "white" : "white")};
  font-size: 16px;
  cursor: ${({ loading }) => (loading ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${({ added }) => (added ? "#218838" : "#218838")};
  }
`;

const LoaderIcon = styled(RiLoader4Line)`
  position: absolute;
  left: 10px;
  font-size: 20px;
  opacity: ${({ loading }) => (loading ? 1 : 0)};
  animation: ${({ loading }) =>
    loading &&
    css`
      ${spin} 1s infinite linear;
    `};
`;

const CartIcon = styled(FaCartPlus)`
  font-size: 20px;
  margin-right: 5px;
  opacity: ${({ added }) => (added ? 1 : 0)};
  transition: opacity 0.3s;
`;

function AddToCartBtn({ id, optionColor, amount, product }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const addProductToCart = async () => {
    setLoading(true);
    await dispatch(addToCart({ id, optionColor, amount, product }));
    setLoading(false);
    setAddedToCart(true);
    dispatch(countCartTotals());
    setTimeout(() => setAddedToCart(false), 2000); // Reset addedToCart state after 2 seconds
  };

  return (
    <Button added={addedToCart} loading={loading} onClick={addProductToCart} disabled={loading}>
      <LoaderIcon loading={loading} />
      <CartIcon added={addedToCart} />
      {loading ? "Adding to Cart" : addedToCart ? "Added to Cart" : "Add to Cart"}
    </Button>
  );
}

export default AddToCartBtn;
