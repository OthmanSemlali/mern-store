import React from "react";
// import { useFilterContext } from "../context/filter_context";
import { BsFillGridFill, BsList, BsSearch } from "react-icons/bs";
import styled from "styled-components";

import { AiOutlineSearch } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  openFilterModal,
  setGridView,
  setListView,
} from "../features/themeSlice";
import { updateSort } from "../features/productSlice";
const Sort = ({ children }) => {
  const dispatch = useDispatch();
  const { products_loading, totalProducts } = useSelector(
    (store) => store.product
  );

  const { productsView, isFilterModalOpen } = useSelector(
    (store) => store.theme
  );
  console.log("productsView", productsView);

  const updateSortHandler = ({ target }) => {
    console.log("target value: ", target.value);
    dispatch(updateSort(target.value));
  };

  return (
    <Wrapper>
      <div className="buttons-container">
        <button
          type="button"
          onClick={() => dispatch(setGridView())}
          className={`${productsView === "grid" ? "active" : null}`}
        >
          <BsFillGridFill />
        </button>
        <button
          type="button"
          onClick={() => dispatch(setListView())}
          className={`${productsView === "list" ? "active" : null}`}
        >
          <BsList />
        </button>

        <button
          className="search-btn"
          onClick={() => dispatch(openFilterModal())}
        >
          Search <AiOutlineSearch />
        </button>
      </div>

      <p>
        {products_loading ? "loading..." : `${totalProducts} products found`}
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

      {isFilterModalOpen ? <div>{children}</div> : null}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 100;
  padding: 1rem;
  transition: background-color 0.3s ease, opacity 0.3s ease,
    box-shadow 0.3s ease;

  /* Styling for when the component is sticky */
  &.sticky {
    background-color: rgba(255, 255, 255, 0.9); /* Reduce opacity */
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Add shadow */
  }

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
