import React from "react";
import styled from "styled-components";
import { FaPlus, FaMinus } from "react-icons/fa";

const AmountButtons = ({increase, decrease, amount}) => {
  // const { id, stock, colors } = product;
// const {order:{amount}, increaseAmount, decreaseAmount} = useProductsContext()
  // const [amount, setAmount] = React.useState(1);

  // const increase = () => {
  //   setAmount((oldAmount) => {
  //     let tempAmount = oldAmount + 1;
  //     if (tempAmount > stock) {
  //       tempAmount = stock;
  //     }
  //     return tempAmount;
  //   });
  // };

  // const decrease = () => {
  //   setAmount((oldAmount) => {
  //     let tempAmount = oldAmount - 1;
  //     if (tempAmount < 1) {
  //       tempAmount = 1;
  //     }
  //     return tempAmount;
  //   });
  // };
  return (
    <Wrapper className="amount-btns">
      <button type="button" className="amount-btn" onClick={decrease}>
        <FaMinus />
      </button>
      <h2 className="amount">{amount}</h2>
      <button type="button" className="amount-btn" onClick={increase}>
        <FaPlus />
      </button>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  width: 140px;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  h2 {
    margin-bottom: 0;
  }
  button {
    background: transparent;
    border-color: transparent;
    cursor: pointer;
    padding: 1rem 0;
    width: 2rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  h2 {
    margin-bottom: 0;
  }
`;

export default AmountButtons;
