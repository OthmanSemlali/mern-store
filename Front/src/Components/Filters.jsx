import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  getCategoriesWithProductsCounts,
  getDistinctFilters,
} from "../features/filterSlice";
import { Navigate, useNavigate } from "react-router-dom";
// import { useFilterContext } from "../context/filter_context";
// import { getUniqueValues, formatPrice } from "../utils/helpers";
// import { FaCheck } from "react-icons/fa";
// import Loading from "./Loading";
// import Modal from "./Modal";

const Filters = ({ filters, setFilter }) => {
  const dispatch = useDispatch();
  console.log('filters---------', filters)
  const naviate = useNavigate()
  const {
    distinctCategoriesWithPostsCount: categories,
    styles,
    materials,
    tileUse,
  } = useSelector((store) => store.filter);
  useEffect(() => {
    dispatch(getCategoriesWithProductsCounts());
    dispatch(getDistinctFilters());
  }, []);

  const updateFilters = ({ target }) => {
    setFilter(target.name, target.value);
  };


  // ************************
  //   const { all_products_loading: loading } = useFilterContext();

  //   const {
  //     filters: {
  //       text,
  //       category,
  //       company,
  //       color,
  //       min_price,
  //       max_price,
  //       price,
  //       shipping,
  //     },
  //     updateFilters,
  //     clearFilters,
  //     all_products,
  //   } = useFilterContext();

  //   const categories = getUniqueValues(all_products, "category");
  //   const colors = getUniqueValues(all_products, "colors");
  //   const companies = getUniqueValues(all_products, "company");

  // track size
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleMediaQueryChange = (event) => {
      setIsSmallScreen(event.matches);
    };

    // Add event listener to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Check the initial value of the media query
    setIsSmallScreen(mediaQuery.matches);

    // Clean up by removing event listener
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  //   if (isSmallScreen && loading) {
  //     return <Loading props="small-loading" />;
  //   }
  return (
    <Wrapper>
      {/* <div className="search-btn">
        <button>Search</button>
      </div> */}
      <div className="content">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Search Input */}
          <div className="form-control">
            <input
              type="text"
              name="text"
              placeholder="Search"
              className="search-input"
              //   value={text}
              //   onChange={updateFilters}
            />
          </div>

          {/* Categories  */}
          <div className="form-control">
            <h5>category</h5>
            <div>
              {categories.map((cat, index) => {
                return (
                  <button
                    key={index}
                    // onClick={() => setFilter("category", cat.category)}
                    onClick={updateFilters}
                    name="category"
                    value={cat.category}
                    type="button"
                    className={`${
                      filters.category &&
                      filters.category === cat.category.toLowerCase()
                        ? "active"
                        : null
                    }`}
                  >
                    {cat.category} ({cat.count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Companies */}

          <div className="form-control">
            <h5>Styles</h5>
            <form>
              <select name="style" className="company" onChange={updateFilters} value={filters.style || ""}>
                <option value={""} >select..</option>
                {styles.map((s, index) => {
                  return (
                    <option key={index} value={s}>
                      {s}
                    </option>
                  );
                })}
              </select>
            </form>
          </div>


          <div className="form-control">
            <h5>tile Use</h5>
            <form>
              <select name="tileUse" className="company" onChange={updateFilters} value={filters.tileUse || ""}>
                <option value={''}>select..</option>
                {tileUse.map((t, index) => {
                  return (
                    <option key={index} value={t}>
                      {t}
                    </option>
                  );
                })}
              </select>
            </form>
          </div>




          <div className="form-control">
            <h5>Materials</h5>
            <form>
              <select name="materials" className="company" onChange={updateFilters} value={filters.materials || ""}>
                <option value={''}>select..</option>
                {materials.map((m, index) => {
                  return (
                    <option key={index} value={m}>
                      {m}
                    </option>
                  );
                })}
              </select>
            </form>
          </div>
          {/* colors */}

          {/* <div className="form-control">
            <h5>colors</h5>
            <div className="colors">
              {colors.map((c, index) => {
                if (c === "all") {
                  return (
                    <button
                      name="color"
                      onClick={updateFilters}
                      data-color="all"
                      className={`${
                        color === "all" ? "all-btn active" : "all-btn"
                      }`}
                    >
                      all
                    </button>
                  );
                }

                return (
                  <button
                    type="button"
                    key={index}
                    name="color"
                    style={{ backgroundColor: c }}
                    className={`${
                      color === c ? "color-btn active" : "color-btn"
                    }`}
                    data-color={c}
                    onClick={updateFilters}
                  >
                    {color === c ? <FaCheck /> : null}
                  </button>
                );
              })}
            </div>
          </div> */}

          {/* Price */}

          {/* <div className="form-control">
            <h5>price</h5>
            <p className="price">{formatPrice(price)} </p>
            <input
              type="range"
              name="price"
              onChange={updateFilters}
              min={min_price}
              max={max_price}
              value={price}
            />
          </div> */}

          {/* Shipping */}
          {/* <div className="form-control shipping">
            <label htmlFor="checkbox">free shipping</label>
            <input
              type="checkbox"
              name="shipping"
              id="shipping"
              onChange={updateFilters}
              checked={shipping}
            />
          </div> */}
          {/* Clear filter btn */}
          <button
            type="button"
            className="clear-btn"
               onClick={()=>naviate('/products')}
          >
            clear filters
          </button>
        </form>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .form-control {
    margin-bottom: 1.25rem;
    h5 {
      margin-bottom: 0.5rem;
    }
  }
  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: var(--spacing);
  }
  .search-input::placeholder {
    text-transform: capitalize;
  }

  button {
    display: block;
    margin: 0.25em 0;
    padding: 0.25rem 0;
    text-transform: capitalize;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
  .active {
    border-color: var(--clr-grey-5);
  }
  .company {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .colors {
    display: flex;
    align-items: center;
  }
  .color-btn {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #222;
    margin-right: 0.5rem;
    border: none;
    cursor: pointer;
    opacity: 0.5;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      font-size: 0.5rem;
      color: var(--clr-white);
    }
  }
  .all-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    opacity: 0.5;
  }
  .active {
    opacity: 1;
  }
  .all-btn .active {
    text-decoration: underline;
  }
  .price {
    margin-bottom: 0.25rem;
  }
  .shipping {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    text-transform: capitalize;
    column-gap: 0.5rem;
    font-size: 1rem;
    max-width: 200px;
  }
  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }

  @media (max-width: 768px) {
    .content {
      display: none;
    }

    // .search-btn {
    //   display: block;
    //   position: fixed;
    //   right: 0;
    //   margin-right: 20px;
    // }

    // .sticky {
    //   top: 0;
    // }
  }

  @media (min-width: 768px) {
    .content {
      position: sticky;
      top: 1rem;
    }
    // .search-btn {
    //   display: none;
    // }
  }
`;

export default Filters;
