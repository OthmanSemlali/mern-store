import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import SkeletonProduct from "../skeletons/SkeletonProduct";
import Product from "./Product";
import { useEffect } from "react";
import { getFeaturedProducts } from "../features/productSlice";
import { Link } from "react-router-dom";
import { SlArrowRight } from "react-icons/sl";

const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { featured_products, featured_products_status: status } = useSelector(
    (store) => store.product
  );

  useEffect(() => {
    dispatch(getFeaturedProducts());
    console.log("featured_products", featured_products);
  }, []);
  //   if (status == "loading") {
  //     return (
  //       <Wrapper className="section">
  //         <div className="title">
  //           <h2>featured products</h2>
  //           <div className="underline"></div>
  //           <div className="section-center featured">
  //             {[0, 1, 2].map((n) => {
  //               return <SkeletonProduct key={n} />;
  //             })}
  //           </div>
  //         </div>
  //       </Wrapper>
  //     // <>
  //     // loading..
  //     // </>
  //     );
  //   }
  if (status === "failed") {
    return (
      <>
        {/* <Error /> */}
        <p className="text-center">Failed to load Featurd books!</p>
      </>
    );
  }
  return (
    <Wrapper className="section">
      <div className="title">
        <h2>featured products</h2>
        <div className="underline"></div>
        <p className="p">
          Explore our exclusive range of top-rated products handpicked just for
          you.
        </p>
        <div className="section-center featured">
          {featured_products.slice(0, 3).map((product) => {
            return <Product key={product.id} {...product} />;
          })}
        </div>
        <Link to="/products" className="title featured-btn">
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
    display: grid;
    gap: 2.5rem;
    img {
      height: 225px;
    }
  }
  .title {
    margin-bottom: 2rem;

    h2 {
      // font-size: 2rem;
      margin-bottom: 1rem;
      // color: #333;
    }
    .underline {
      width: 6rem;
      height: 0.25rem;
      background: #333;
      margin: 0 auto;
      margin-bottom: 2rem;
    }
  .p {
   
      font-size: 1.2rem;
      color: #666;
      margin-bottom: 1.5rem;
  
  }

  .featured-btn {
    // display: block;
    // padding: 0px auto;
    // text-align: center;
    color: #ab7a5f;
  }
  .thumbnail-wrapper {
    height: 225px;
  }
  @media (min-width: 576px) {
    .featured {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
  }
`;

export default FeaturedProducts;
