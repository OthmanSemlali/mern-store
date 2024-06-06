import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import AmountButtons from "./AmountButtons";
import AddToCartBtn from "./AddToCartBtn";

const AddToCart = ({ product, increase, decrease, amount }) => {
  const { id, stock } = product;

  const fixRef = React.useRef(null);
  const fixedRef = React.useRef(null);

  return (
    <Wrapper>
      <div className="btn-container" ref={fixRef}>
        <AmountButtons
          increase={increase}
          decrease={decrease}
          amount={amount}
        />

        <AddToCartBtn
          id={id}
          optionColor={"black"}
          amount={amount}
          product={product}
        />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin-top: 2rem;
  .colors {
    display: grid;
    grid-template-columns: 125px 1fr;
    align-items: center;
    margin-bottom: 1rem;
    span {
      text-transform: capitalize;
      font-weight: 700;
    }
    div {
      display: flex;
    }
  }
  .color-btn {
    display: inline-block;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: #222;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 0.75rem;
      color: var(--clr-white);
    }
  }
  .active {
    opacity: 1;
  }
  .btn-container {
    margin-top: 2rem;

    display: flex;
    justify-content: space-between;
  }

  .btn {
    margin-top: 1rem;
    width: 140px;
  }
`;
export default AddToCart;
