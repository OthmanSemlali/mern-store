
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import SkeletonProduct from "../skeletons/SkeletonProduct";
import Product from "./Product";
import { useEffect } from "react";
import { getFeaturedProducts } from "../features/productSlice";


const FeaturedProducts = () => {
  const dispatch = useDispatch();
  const { featured_products, featured_products_status: status } = useSelector(
    (store) => store.product
  );

  useEffect(() => {
    dispatch(getFeaturedProducts())
    console.log('featured_products', featured_products)
  },[]);
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
        <div className="section-center featured">
          {featured_products.slice(0, 3).map((product) => {
            return <Product key={product.id} {...product} />;
          })}
        </div>
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
  .btn {
    display: block;
    width: 148px;
    margin: 0 auto;
    text-align: center;
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
