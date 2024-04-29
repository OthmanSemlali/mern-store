import React, { useEffect, useMemo } from "react";
import Filters from "../Components/Filters";
import ProductList from "../Components/ProductList";
import styled from "styled-components";
import queryString from "query-string";
import { useDispatch, useSelector } from "react-redux";
import { getDistinctFilters } from "../features/filterSlice";
import { fetchPaginatedProducts } from "../features/productSlice";
import { useNavigate } from "react-router-dom";
import PaginationControls from "../Components/PaginationControls";
import { PageHero, Sort } from "../Components";
function Products() {

  

  // const {totalProducts} = useSelector((store)=>store.product)
  const parsed = queryString.parse(location.search);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  

  const { page } = parsed;
  const filters = useMemo(() => ({ ...parsed }), [parsed]);

  const {category, style, tileUse, materials} = filters
  useEffect(() => {
    console.log("query changes", page, filters);
    dispatch(fetchPaginatedProducts({ page, filters }));
    dispatch(getDistinctFilters());

    window.scrollTo({ top: 100, behavior: "smooth" });

  }, [dispatch, page, category, style, tileUse, materials]);


  const setFilter = (name, value) => {
   
    const params = new URLSearchParams(window.location.search);
    params.set('page', 1);
    
    // Set the filter value if it's not empty
    if (value.trim() !== "") {
      params.set(name, value);
    } else {
      // If the value is empty, remove the filter from the query string
      params.delete(name);
    }
    
    const newParamsString = params.toString();
    const newUrl = `${window.location.pathname}${newParamsString ? '?' + newParamsString : ''}`;
    
    navigate(newUrl);

  };
  
  return (
    <main>
      {/* <PageHero title="products"  /> */}
      {/* <Modal Children={<FiltersModal />}  /> */}

      <Wrapper className="page">
        <div className="section-center products">
          <Filters filters={filters} setFilter={setFilter}/>

          <div>
            <Sort  />
            <ProductList />
            <PaginationControls currentPage={page} />
          </div>
        </div>
      </Wrapper>
    </main>
  );
}

export default Products;

const Wrapper = styled.div`
  .products {
    display: grid;
    gap: 3rem 1.5rem;
    margin: 2rem auto;
    // margin: 4rem auto;
  }
  @media (min-width: 768px) {
    .products {
      grid-template-columns: 200px 1fr;
    }
  }
`;
