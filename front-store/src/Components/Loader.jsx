import React from "react";
import styled from "styled-components";
const Spinner = styled.div`
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-top: 2px solid #fff; /* Change border-top color to white */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  margin-left: 5px;
  animation: spin 1s linear infinite;
  color: #fff; /* Set the color to white */

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const Loader = () => {
  return <Spinner />;
};

export default Loader;
