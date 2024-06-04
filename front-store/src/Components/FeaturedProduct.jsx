import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { formatPrice } from "../Utils/helpers";

const Product = ({ slug, options, name, price, id }) => {
  return (
    <Wrapper>
      <div className="container">
        <img src={options[0]?.images[0]} alt={name} />
        <Link to={`/products/${slug}`} className="link">
          <FaSearch />
        </Link>
      </div>
      <footer>
        <h5>{name}</h5>
        <p>{formatPrice(price)}</p>
      </footer>
    </Wrapper>
  );
};

const Wrapper = styled.article`
  background: var(--clr-white);
  border: 1px solid var(--clr-grey-9);
  border-radius: var(--radius);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .container {
    position: relative;
    background: var(--clr-grey-10);
    border-bottom: 1px solid var(--clr-grey-9);
    border-radius: var(--radius) var(--radius) 0 0;
    overflow: hidden;
    padding: 1rem; /* Adjust the padding as needed */
  }

  img {
    width: 100%;
    display: block;
    object-fit: cover;
    transition: var(--transition);
  }

  .link {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--clr-primary-5);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    transition: var(--transition);
    opacity: 0;
    cursor: pointer;

    svg {
      font-size: 1.25rem;
      color: var(--clr-white);
    }
  }

  .container:hover img {
    opacity: 0.5;
  }

  .container:hover .link {
    opacity: 1;
  }

  footer {
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: var(--clr-grey-10);
    border-radius: 0 0 var(--radius) var(--radius);

    h5,
    p {
      margin-bottom: 0;
      font-weight: 400;
    }

    h5 {
      font-size: 1rem;
      color: var(--clr-grey-1);
    }

    p {
      color: var(--clr-primary-5);
      letter-spacing: var(--spacing);
      font-size: 1rem;
    }
    @media (max-width: 991px) {
      flex-direction: column; /* Display items in a column */
      text-align: center; /* Center align text */
    }
  }
`;

export default Product;
