import styled from "styled-components";
import { Link } from "react-router-dom";
import bg1 from "./images/bg1.png";

const Hero = () => {
  return (
    <Wrapper>
      <article className="content">
        <h3>Explore ZELIJ Home Decor</h3>
        <p>
          Find your perfect home decor at ZELIJ. From stylish accents to
          essential pieces, we've got what you need to make your space feel like
          home.
        </p>
        <Link to="/products" className="btn hero-btn">
          shop now
        </Link>
      </article>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  width: 100vw;
  height: calc(100vh - 5rem);
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background: url("https://saharadesigns.com/cdn/shop/files/Eight_pointed_star_moroccan_mosaic_with_laces_for_kitchen_1400x.jpg?v=1701540046")
    no-repeat center center/cover;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4); /* Overlay color */
    }
  .content {
    z-index: 1;
    text-align: center;
    color: white;

    h3 {
      font-size: 2rem; /* Increased font size for better visibility */
      margin-bottom: 1rem;
    }
  
    p {
      line-height: 2; /* Adjusted line height for better readability */
      max-width: 45em;
      margin: 0 auto 2rem auto;
      color: white;
      opacity:.9;
      font-size: 1.25rem; /* Increased font size for better visibility */
    }

    .hero-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      background: var(--clr-primary-5);
      color: var(--clr-white);
      border: none;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: var(--clr-primary-7);
      }
    }
  }

  @media (max-width: 991px) {
    background: url(${bg1}) no-repeat center center/cover;

    .content {
      h3 {
        font-size: 2rem;
      }

      p {
        font-size: 1rem;
      }

      .hero-btn {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }
    }
  }
`;

export default Hero;
