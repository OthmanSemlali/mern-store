// import React from "react";
import styled from "styled-components";
import Product from "./Product";
// import Product from "./Product";

const GridView = ({ products }) => {
  return (
    <Wrapper>
      <div className="products-container">
        {products.map((product) => {
          return <Product key={product.id} {...product} />;
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
  img {
    // height: 175px;
    height: 300px;
    // width: 300px;

  }
 
  @media (min-width: 930px) {
    
    img {
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

    img {
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
    img {
      width: 100%;
      height:200px
    }
    .products-container {
 
      // background-color:black

    }
  }
`;

export default GridView;
