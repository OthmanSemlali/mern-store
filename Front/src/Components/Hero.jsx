import styled from "styled-components";
import { Link } from "react-router-dom";
import heroBcg from "../assets/w_740.webp";

const Hero = () => {
  return (
    <Wrapper className="section-center">
      <article className="content">
        <h3>Explore ZELIJ Home Decor</h3> 
        <p>
        Find your perfect home decor at ZELIJ. From stylish accents to essential pieces, we've got what you need to make your space feel like home.
        </p>
        <Link to="/products" className="btn hero-btn">
          shop now
        </Link>
      </article>
      <article className="img-container">
        <img src={heroBcg} alt="library" className="main-img" height={400}  />
      </article>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  // min-height: 80vh;
  // min-height:100vh
  height: calc(100vh - 5rem);

  display: grid;
  place-items: center;
  padding: 3%;
  .img-container {
    display: none;
  }

  p {
    line-height: 2;
    max-width: 45em;
    margin-bottom: 2rem;
    color: var(--clr-grey-5);
    font-size: 1rem;
  }
  @media (min-width: 992px) {
    // background-color:red;
    height: calc(100vh - 5rem);
    grid-template-columns: 1fr 1fr;
    gap: 8rem;
    h2 {
      margin-bottom: 2rem;
    }
    p {
      font-size: 1.25rem;
    }
    .hero-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }
    .img-container {
      display: block;
      position: relative;
    }
    .main-img {
      width: 100%;
      height: 5O0px;
      position: relative;
      border-radius: var(--radius);
      display: block;
      object-fit: cover;
    }
    .accent-img {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 250px;
      transform: translateX(-50%);
      border-radius: var(--radius);
    }
    .img-container::before {
      content: "";
      position: absolute;
      width: 10%;
      height: 80%;
      background: var(--clr-primary-9);
      bottom: 0%;
      left: -8%;
      border-radius: var(--radius);
    }
  }
`;

export default Hero;
