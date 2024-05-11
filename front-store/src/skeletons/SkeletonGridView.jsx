import React from "react";
import styled from "styled-components";


import SkeletonProduct from "./SkeletonProduct";

const SkeletonGridView = () => {
  return (
    <Wrapper>
      <div className="products-container">
        {[0,1,2,3,4,6].map((n) => {
          return <SkeletonProduct key={n} />;
        })}
      </div>

     

    </Wrapper>
  );
};

const Wrapper = styled.section`
  .products-container {
    display: grid;
    gap: 2rem 1.5rem;
  }
  .thumbnail-wrapper {
    // height: 175px;
    height: 300px;
    // width: 300px;

  }
 
  @media (min-width: 930px) {
    .thumbnail-wrapper {
      // height: 175px;
      height: 250px;
      // width: 300px;

    }
    .products-container {
      grid-template-columns: repeat(2, 1fr);

      // background-color:red
    }
  }
  @media (min-width: 1170px) {
    .products-container {
      grid-template-columns: repeat(3, 1fr);
      // background-color:aqua

    }

    .thumbnail-wrapper {
      width: 300px;
      height: 200px;
    }
  }

  @media (max-width: 766px) and (min-width: 645px) {

    .products-container {
      grid-template-columns: repeat(2, 1fr);
      // background-color:aqua

    }
  }


  @media (max-width: 450px) {
    .thumbnail-wrapper {
      width: 100%;
      height:200px
    }
    .products-container {
 
      // background-color:black

    }
  }
`;

export default SkeletonGridView;
