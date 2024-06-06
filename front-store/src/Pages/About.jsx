import styled from "styled-components";
import aboutImg from "../assets/w_740.webp";

const AboutPage = () => {
  return (
    <main>
      {/* <PageHero title='about' /> */}
      <Wrapper className="page section section-center">
        <img src={aboutImg} alt="keep reading" />
        <article>
          <div className="title">
            <h2>our story</h2>
            <div className="underline"></div>
          </div>
          <p>
            Welcome to Zellige, your premier destination for exquisite zellige
            tiles and unique tile pieces. Our store is dedicated to offering
            high-quality, handcrafted tiles that reflect the rich heritage and
            beauty of Moroccan architecture. Whether you're renovating your home
            or starting a new project, our extensive collection of vibrant,
            intricately designed zellige tiles will bring elegance and timeless
            charm to any space. At Zellige, we are passionate about
            craftsmanship and committed to providing exceptional customer
            service, ensuring that each piece you purchase is a perfect blend of
            tradition and sophistication.
          </p>
        </article>
      </Wrapper>
    </main>
  );
};

const Wrapper = styled.section`
  display: grid;
  gap: 4rem;
  img {
    width: 100%;
    display: block;
    border-radius: var(--radius);
    height: 500px;
    object-fit: cover;
  }
  p {
    line-height: 2;
    max-width: 45em;
    margin: 0 auto;
    margin-top: 2rem;
    color: var(--clr-grey-5);
  }
  .title {
    text-align: left;
  }
  .underline {
    margin-left: 0;
  }
  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;
export default AboutPage;
