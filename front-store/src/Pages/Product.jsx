import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchProduct, setOptions } from "../features/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { AddToCart, Error, ProductImages } from "../Components";
import { formatPrice } from "../Utils/helpers";
import styled from "styled-components";
import { SingleProductSkeleton } from "../skeletons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

// import { countCartTotals } from "../features/cartSlice";

function Product() {
  const {
    single_product: product,
    single_product_loading: loading,
    single_product_error: error,
    selected_option_images,
  } = useSelector((store) => store.product);
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [amount, setAmount] = React.useState(1);
  const {
    id,
    name,
    description,
    image,
    price,
    stock,
    size,
    options,
    style,
    tileUse,
    materials,
    sellerID,
    categoryID,
  } = product;
  //   const [selectedOprionImages, setSelectedOptionImages] = useState(selected_option_images);

  useEffect(() => {
    dispatch(fetchProduct(slug));

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  console.log("product", product);

  if (error) {
    return (
      <div className="text-center page-100">
        <Error status={505} />
        <Link to="/">Home</Link>
      </div>
    );
  }

  // if(!id){
  //   return (
  //     <div className="text-center page-100">
  //       <Error status={201} />
  //       <Link to="/">Home</Link>
  //     </div>
  //   );
  // }

  console.log("product", product);

  const increase = () => {
    setAmount((oldAmount) => {
      let tempAmount = oldAmount + 1;
      if (tempAmount > stock) {
        tempAmount = stock;
      }
      return tempAmount;
    });
  };

  const decrease = () => {
    setAmount((oldAmount) => {
      let tempAmount = oldAmount - 1;
      if (tempAmount < 1) {
        tempAmount = 1;
      }
      return tempAmount;
    });
  };

  console.log("selectedOptionsImages", selected_option_images);
  //   console.log('selectedOptionsImages', image)

  if (loading) {
    // return <Loading props="loading" />;
    return (
      <Wrapper>
        {/* <PageHero title={name} product /> */}
        <div className="section section-center page">
          <Link to="/book" className="btn">
            back to books
          </Link>

          <SingleProductSkeleton />
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div className="section section-center page">
        <Link to="/products" className="btn">
          back to products
        </Link>

        <div className="product-center">
          <ProductImages image={image} images={selected_option_images} />

          <section className="content">
            {/* <h2 dir={lang === "ar" ? "rtl" : "ltr"}>{name}</h2> */}

            {/* <Stars stars={stars} reviews={reviews} /> */}

            <h5 className="price">{formatPrice(price)}</h5>

            {/* <p className="desc">
              {readMore ? overview : `${String(overview).substring(0, 240)}...`}

              <span
                className="read-more"
                onClick={() => setReadMore(!readMore)}
              >
                {readMore ? "  show less" : "  read more"}
              </span>
            </p> */}

            <p className="desc">{description}</p>
            <p className="info">
              <span>SKU : </span>
              {id}
            </p>
            <p className="info">
              <span>Available : </span>
              {stock > 0 ? "In stock" : "Out of stock"}
            </p>

            <p className="info">
              <span>category : </span>
              {"cat1"}
            </p>

            <p className="info">
              <span>style : </span>
              {style}
            </p>

            <p className="info">
  <span>Size : </span>
  {size?.width} x {size?.height}
</p>


            <p className="info">
              <span>tile use : </span>
              {tileUse}
            </p>

            <p className="info">
              <span>materials : </span>
              {materials}
            </p>

            <p className="info">
              <span>options : </span>

              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {options &&
                  options.map((o) => {
                    return (
                      <span style={{cursor:"pointer"}} onClick={() => dispatch(setOptions(o.images))}>
                        {o.color}
                      </span>
                    );
                  })}
              </div>
            </p>

            <p className="info">
              <span>
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  style={{ marginRight: "0.5rem" }}
                />
                Box Contains :
              </span>
              20 pcs
            </p>
            <hr />

            {stock > 0 ? (
              <div>
                <AddToCart
                  product={product}
                  increase={increase}
                  decrease={decrease}
                  amount={amount}
                />
              </div>
            ) : null}
          </section>
        </div>

        {/* <div className="title-review">
          <h2>
            <span style={{color:"var(--clr-primary-10)"}}>/</span> reviews
          </h2>
        </div>

<br></br>
<br></br>
        <div className="title-review">
          <h2>
            <span style={{color:"var(--clr-primary-10)"}}>/</span> Related Products
          </h2>
        </div> */}
        {/* <Tabs /> */}
        {/* <CustomerReview idBook={1} />

        <SubmitReview name={name} />

        <RelatedBooks category={category} id={id} /> */}
      </div>
    </Wrapper>
  );
}

export default Product;

const Wrapper = styled.main`
  .product-center {
    display: grid;
    gap: 4rem;
    margin-top: 2rem;
  }
  .price {
    color: var(--clr-primary-5);
  }
  .desc {
    line-height: 2;
    max-width: 45em;
  }
  .info {
    text-transform: capitalize;
    width: 300px;
    display: grid;
    grid-template-columns: 125px 1fr;
    span {
      font-weight: 700;
    }
  }

  @media (min-width: 850px) {
    .product-center {
      grid-template-columns: 1fr 1fr;
      // align-items: center;
    }
    .price {
      font-size: 1.25rem;
    }
  }

  .fixed {
    position: fixed;
    bottom: 0;
    opacity: 0;
    transform: translateY(100%);
    transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    background-color: aqua;
    height: 60px;
    width: 100%;
    z-index: 10;
    /* add any other styles here */
  }

  .fixed.show {
    opacity: 1;
    transform: translateY(0);
  }

  .fixed.hide {
    opacity: 0;
  }
`;
