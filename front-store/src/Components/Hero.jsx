import styled from "styled-components";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdNavigateNext } from "react-icons/md";
import { GrPrevious } from "react-icons/gr";

const Hero = () => {
  return (
    <Wrapper className="section-center">
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        showArrows={false}
        showIndicators={false}
        interval={5000}
        // cssEase="linear"
        className="carousel"
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="arrow-prev"
            >
              <span>
                <GrPrevious />
              </span>
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="arrow-next"
            >
              <span>
                <MdNavigateNext />
              </span>
            </button>
          )
        }
      >
        <div>
          <img
            src="https://www.mainzu.com/src/image/slider_home/grd/BLEU-SUNSET-MAINZU.jpg"
            alt="Background 1"
          />
        </div>
        <div>
          <img
            src="https://www.mainzu.com/src/image/slider_home/grd/AQUAMARINE-LUGANO-MAINZU.jpg"
            alt="Background 2"
          />
        </div>
        <div>
          <img
            src="https://www.mainzu.com/src/image/slider_home/grd/CUERO-FONDANT-PISCINA-MAINZU.jpg"
            alt="Background 3"
          />
        </div>
        <div>
          <img
            src="https://www.mainzu.com/src/image/slider_home/grd/TERRA-MOKA-SAJONIA-MAINZU.jpg"
            alt="Background 4"
          />
        </div>
        <div>
          <img
            src="https://www.mainzu.com/src/image/slider_home/grd/SHOJI-VILLAGE-MAINZU.jpg"
            alt="Background 5"
          />
        </div>
        <div>
          <img
            src="https://www.mainzu.com/src/image/slider_home/grd/COTTO-TEGUISE-MAINZU.jpg"
            alt="Background 6"
          />
        </div>
        <div>
          <img
            src="https://www.mainzu.com/src/image/slider_home/grd/ALPES-MAINZU.jpg"
            alt="Background 7"
          />
        </div>
        <div>
          <img
            src="https://www.mainzu.com/src/image/slider_home/grd/GREEN-HANOI-MAINZU.jpg"
            alt="Background 8"
          />
        </div>
      </Carousel>

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
  width: 100vw; /* Take width of the full page */
  height: calc(100vh - 5rem);
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;

  .carousel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    .carousel .slide img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .content {
    z-index: 1;
    text-align: center;
    color: white;

    h3 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    p {
      line-height: 2;
      max-width: 45em;
      margin: 0 auto 2rem auto;
      color: white;
      font-size: 1rem;
    }

    .hero-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
    }
  }

  .arrow-prev,
  .arrow-next {
    // position: absolute;
    // top: 50%;
    // transform: translateY(-50%);
    // background-color: rgba(0, 0, 0, 0.5);
    // color: red;
    // border: none;
    // outline: none;
    // cursor: pointer;
    // padding: 1rem;
    // font-size: 1.5rem;
    // z-index: 10;
    // // transition: background-color 0.3s;
  }

  .arrow-prev {
    left: 0;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }

  .arrow-next {
    right: 0;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  .arrow-prev:hover,
  .arrow-next:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }

  @media (min-width: 992px) {
    .content {
      h3 {
        font-size: 3rem;
      }

      p {
        font-size: 1.25rem;
      }

      .hero-btn {
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
      }
    }
  }
`;

export default Hero;
