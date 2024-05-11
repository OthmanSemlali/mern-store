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
           Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis doloremque officia animi. Qui dolor inventore doloremque quidem dolores aperiam totam esse non eveniet sunt. Quis ipsa ab cum doloremque natus, molestias ipsum nesciunt est sunt repudiandae dolor perspiciatis recusandae fugiat, expedita asperiores dicta ut explicabo similique rerum veritatis delectus. Dolorem fuga harum corrupti eos sit quas provident veritatis vitae inventore totam velit, quo labore. Necessitatibus eum dolore pariatur ipsa ut suscipit consequatur, blanditiis veniam asperiores sed eos consectetur tempore illo doloremque expedita ducimus rem vero? Nemo dignissimos earum quae molestiae alias odio, repellendus debitis perspiciatis tempore officiis quos! Earum, ab?
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
