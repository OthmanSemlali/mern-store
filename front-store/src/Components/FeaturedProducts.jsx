import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import SkeletonProduct from "../skeletons/SkeletonProduct";
import Product from "./FeaturedProduct";
import { getFeaturedProducts } from "../features/productSlice";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { featured_products, featured_products_status: status } = useSelector(
    (store) => store.product
  );

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  if (status === "failed") {
    return <p className="text-center">Failed to load Featured Products!</p>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Wrapper className="section">
      <div className="title">
        <h2>featured products</h2>
        <div className="underline"></div>
        <p className="p">
          Explore our exclusive range of top-rated products handpicked just for
          you.
        </p>
        <Slider {...settings} className="section-center featured">
          {status === "loading"
            ? [0, 1, 2].map((n) => <SkeletonProduct key={n} />)
            : featured_products.map((product) => (
                <Product key={product.id} {...product} />
              ))}
        </Slider>
        <Link to="/products" className="title btn">
          See All Products
        </Link>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: var(--clr-grey-10);
  .featured {
    margin: 4rem auto;
    .slick-slide {
      padding: 0 1rem;
    }
    img {
      height: 225px;
    }
  }
  h2 {
    margin-bottom: 1rem;
  }
  .underline {
    margin: 0 auto;
    margin-bottom: 2rem;
  }
  .p {
    font-size: 1.2rem;
    color: #666;
    margin-bottom: 1.5rem;
  }
  .slick-next:before,
  .slick-prev:before {
    color: var(--clr-primary-5);
  }

  .thumbnail-wrapper {
    height: 225px;
  }
`;

export default FeaturedProducts;
