import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  getCategoriesWithProductsCounts,
  getDistinctFilters,
} from "../features/filterSlice";
import { useNavigate } from "react-router-dom";

const Filters = ({ filters, setFilter, handleDragEnd, handleDragStart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  // const [openFilter, setOpenFilter] = useState(null);
  // const toggleFilter = (filterName) => {
  //   setOpenFilter((prevFilter) =>
  //     prevFilter === filterName ? null : filterName
  //   );
  // };

  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const togglePrice = () => {
    setIsPriceOpen(!isPriceOpen);
  };

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const toggleCategory = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const [isStylesOpen, setIsStylesOpen] = useState(false);
  const toggleStyles = () => {
    setIsStylesOpen(!isStylesOpen);
  };

  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const toggleMaterials = () => {
    setIsMaterialsOpen(!isMaterialsOpen);
  };

  const [isTileUseOpen, setIsTileUseOpen] = useState(false);
  const toggleTileUse = () => {
    setIsTileUseOpen(!isTileUseOpen);
  };

  return (
    <Wrapper>
      <div className="content">
        <form onSubmit={(e) => e.preventDefault()}>
          <FormControl>
            <input
              type="text"
              name="searchQuery"
              onChange={updateFilters}
              placeholder="Search"
              className="search-input"
            />
          </FormControl>

          <FilterGroup>
            <FilterTitle onClick={() => toggleCategory()}>
              Category
              <ArrowIcon isOpen={isCategoryOpen} />
            </FilterTitle>
            {isCategoryOpen && (
              <FilterList>
                {categories.map((cat, index) => (
                  <FilterItem
                    key={index}
                    onClick={() => {
                      setFilter("category", cat.category);
                    }}
                    className={
                      filters.category === cat.category.toLowerCase()
                        ? "active"
                        : ""
                    }
                  >
                    {cat.category} ({cat.count})
                  </FilterItem>
                ))}
              </FilterList>
            )}
          </FilterGroup>

          <FilterGroup>
            <FilterTitle onClick={() => toggleStyles()}>
              Styles
              <ArrowIcon isOpen={isStylesOpen} />
            </FilterTitle>
            {isStylesOpen && (
              <FilterList>
                {styles.map((style, index) => (
                  <FilterItem
                    key={index}
                    onClick={() => {
                      setFilter("style", style);
                    }}
                    className={
                      filters.style === style.toLowerCase() ? "active" : ""
                    }
                  >
                    {style}
                  </FilterItem>
                ))}
              </FilterList>
            )}
          </FilterGroup>

          <FilterGroup>
            <FilterTitle onClick={() => toggleMaterials()}>
              Materials
              <ArrowIcon isOpen={isMaterialsOpen} />
            </FilterTitle>
            {isMaterialsOpen && (
              <FilterList>
                {materials.map((material, index) => (
                  <FilterItem
                    key={index}
                    onClick={() => {
                      setFilter("materials", material);
                    }}
                    className={
                      filters.materials === material.toLowerCase()
                        ? "active"
                        : ""
                    }
                  >
                    {material}
                  </FilterItem>
                ))}
              </FilterList>
            )}
          </FilterGroup>

          <FilterGroup>
            <FilterTitle onClick={() => toggleTileUse()}>
              Tile Use
              <ArrowIcon isOpen={isTileUseOpen} />
            </FilterTitle>
            {isTileUseOpen && (
              <FilterList>
                {tileUse.map((use, index) => (
                  <FilterItem
                    key={index}
                    onClick={() => {
                      setFilter("tileUse", use);
                    }}
                    className={
                      filters.tileUse === use.toLowerCase() ? "active" : ""
                    }
                  >
                    {use}
                  </FilterItem>
                ))}
              </FilterList>
            )}
          </FilterGroup>

          <FilterGroup>
            <FilterTitle onClick={() => togglePrice()}>
              Price
              <ArrowIcon isOpen={isPriceOpen} />
            </FilterTitle>
            {isPriceOpen && (
              <FormControl>
                <p className="price">{/* {formatPrice(price)} */}</p>
                <input
                  type="range"
                  name="maxPrice"
                  onChange={updateFilters}
                  onMouseUp={handleDragEnd}
                  onMouseDown={handleDragStart}
                  min="1"
                  max="1000"
                />
              </FormControl>
            )}
          </FilterGroup>

          <button
            type="button"
            className="clear-btn"
            onClick={() => {
              navigate("/products");
              setIsCategoryOpen(false);
              setIsStylesOpen(false);
              setIsMaterialsOpen(false);
              setIsPriceOpen(false);
              setIsTileUseOpen(false);
            }}
          >
            Clear Filters
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
    width:100%;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: var(--spacing);
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

  @media (max-width: 768px) {
    .content {
      display: none;
    }
  }
`;

const FormControl = styled.div`
  margin-bottom: 1.25rem;
  h5 {
    margin-bottom: 0.5rem;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 1.25rem;

`;

const FilterTitle = styled.h5`
  // Styles for the filter title component
  display: flex;
  justify-content:space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.25rem;
  background-color: var(--clr-grey-10);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--clr-grey-9);
  }
`;

const ArrowIcon = styled.div`
  // Styles for the arrow icon component
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 5px 0 5px;
  border-color: var(--clr-grey-6) transparent transparent transparent;
  margin-left: 0.5rem;
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0)")};
`;

const FilterList = styled.div`
  margin-top: 0.5rem;
`;

const FilterItem = styled.button`
  display: block;
  margin-bottom: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: var(--clr-grey-10);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  &:hover {
    background-color: var(--clr-grey-9);
  }
  &.active {
    background-color: var(--clr-grey-8);
  }
`;

export default Filters;
