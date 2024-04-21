import React from "react";
import SkeletonElement from "./SkeletonElement";
import styled from "styled-components";
// import { Link } from "react-router-dom";
// import { FaSearch } from "react-icons/fa";
// import Shimmer from "./Shimmer";

const SkeletonProduct = () => {
  return (
    <Wrapper>
      <div className="container">
        <div className="thumbnail-wrapper">
          {/* image place */}
          <SkeletonElement type="thumbnail" />
        </div>
      {/* <Shimmer /> */}
        
      </div>
      <footer>
        <SkeletonElement type="title" />

        <SkeletonElement type="text" />
      </footer>
    </Wrapper>
  );
};

const Wrapper = styled.article`
  position: relative;

  .container {
    position: relative;

    border-radius: var(--radius);
  }

  .thumbnail-wrapper {
    width: 100%;
    display: block;
    // object-fit: cover;
    border-radius: var(--radius);
    transition: var(--transition);
  }

  footer {
    margin-top: 1rem;
    margin-right: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  footer h5,
  footer price-wrapper {
    margin-bottom: 0;
  }
`;
export default SkeletonProduct;
