// import React from "react";
import styled from "styled-components";
// import { formatPrice } from "../utils/helpers";
import { Link } from "react-router-dom";
import { formatPrice } from "../Utils/helpers";
const ListView = ({ products }) => {
  return (
    <Wrapper>
      {products.map((product) => {
        const { id, name, slug, price, options, description, published } = product;
// console.log('published', published)

if(published == false) {
  return
}
        return (
          <article key={id}>
            <img src={options[0]?.images[0]} alt={name} />

            <div>
              <h4>{name} </h4>
              <h5 className="price">{formatPrice(parseInt(price))} </h5>
              <p>{description.substring(0, 220)}... </p>
              {/* <p>{description.length}... </p> */}
              <Link to={`/products/${slug}`} className="btn">
                Details
              </Link>
            </div>
          </article>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  row-gap: 3rem;

  img {
    width: 100%;
    display: block;
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: var(--radius);
    margin-bottom: 1rem;
  }
  h4 {
    margin-bottom: 0.5rem;
  }
  .price {
    color: var(--clr-primary-5);
    margin-bottom: 0.75rem;
  }
  p {
    max-width: 45em;
    margin-bottom: 1rem;
  }
  .btn {
    // font-size: 0.5rem;
    // padding: 0.25rem 0.5rem;
  }
  @media (min-width: 992px) {
    article {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 2rem;
      // align-items: center;
    }
  }
  @media (max-width: 450px) {
    img {
      width: 100%;
    }
  }
`;

export default ListView;
