import React from "react";
// import { useFilterContext } from "../context/filter_context";
import { BsFillGridFill, BsList, BsSearch } from "react-icons/bs";
import styled from "styled-components";

import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setGridView, setListView } from "../features/themeSlice";
import { updateSort } from "../features/productSlice";
const Sort = () => {
  const dispatch = useDispatch();
  const { products_loading, totalProducts } = useSelector(
    (store) => store.product
  );

  const { productsView } = useSelector((store) => store.theme);
  console.log("productsView", productsView);

  const updateSortHandler = ({ target }) => {
    console.log("target value: ", target.value);
    dispatch(updateSort(target.value));
  };

  return (
    <Wrapper>
      <div className="buttons-container">
        <button
          type="butotn"
          onClick={() => dispatch(setGridView())}
          className={`${productsView == "grid" ? "active" : null}`}
        >
          <BsFillGridFill />
        </button>
        <button
          type="butotn"
          onClick={() => dispatch(setListView())}
          className={`${productsView == "list" ? "active" : null}`}
        >
          <BsList />
        </button>

        <button className="search-btn">
          Search <AiOutlineSearch />
        </button>
      </div>

      <p>
        {products_loading ? "loading..." : `${totalProducts} products found`}

        {/* f */}
      </p>
      <hr />

      <form>
        <label htmlFor="sort">sort by</label>
        <select
          name="sort"
          id="sort"
          className="sort-input"
          onChange={updateSortHandler}
        >
          <option value="price-lowest">price (lowest)</option>
          <option value="price-highest">price (highest)</option>
          <option value="name-a">name (a-z)</option>
          <option value="name-z">name (z-a)</option>
        </select>
      </form>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  margin-bottom: 2rem;
  column-gap: 2rem;

  select:hover {
    cursor: pointer;
  }

  p {
    text-transform: capitalize;
    margin-bottom: 0;
  }

  .buttons-container {
    display: grid;
    grid-template-columns: 1fr 1fr 3fr;
    column-gap: 0.5rem;
    .search-btn {
      // background: transparent;
      border: 1px solid var(--clr-black);
      color: var(--clr-black);
      width: 4rem;
      border-radius: var(--radius);
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        font-size: 1rem;
      }

      // show the search btn only in small screen
    }
    button {
      background: transparent;
      border: 1px solid var(--clr-black);
      color: var(--clr-black);
      width: 1.5rem;
      border-radius: var(--radius);
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      svg {
        font-size: 1rem;
      }
    }

    .active {
      background: var(--clr-black);
      color: var(--clr-white);
    }

    @media (min-width: 768px) {
      // .buttons-container:{
      grid-template-columns: 1fr 1fr;
      // }
      .search-btn {
        display: none;
      }
    }
  }

  .sort-input {
    border-color: transparent;
    font-size: 1rem;
    text-transform: capitalize;
    padding: 0.25rem 0.5rem;
  }
  label {
    font-size: 1rem;
    text-transform: capitalize;
  }

  @media (max-width: 950px) and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.75rem;
    .buttons-container {
      width: 50px;
    }
  }
  @media (max-width: 660px) {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.75rem;
    .buttons-container {
      width: 50px;
    }
    label {
      display: inline-block;
      margin-right: 0.5rem;
    }
  }
  @media (min-width: 768px) {
    column-gap: 2rem;
  }
`;

export default Sort;
