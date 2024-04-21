import React from "react";
import styled from "styled-components";

import SkeletonElement from "./SkeletonElement";
import Shimmer from "./Shimmer";
const SkeletonListView = () => {
  return (
    <Wrapper>
      {[0, 1, 2, 3, 4, 6].map((n) => {
        return (
          <article key={n}>

            <div className="thumbnail-wrapper">
              {/* image place */}
              <SkeletonElement type="thumbnail" />
            </div>

            <div>
              <SkeletonElement type="title" />
              {/* <SkeletonElement type="title" /> */}
              <SkeletonElement type="text" />
              <SkeletonElement type="short-text" />
            </div>
            {/* <Shimmer /> */}

          </article>
        );
      })}
    </Wrapper>
  );
};

const Wrapper = styled.section`
  display: grid;
  row-gap: 3rem;

  article {
    position: relative;
  }
  .thumbnail-wrapper {
    width: 100%;
    display: block;
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: var(--radius);
    margin-bottom: 1rem;
  }
  h4 {
    margin-bottom: 0.5rem;
  }
  .price {
    color: var(--clr-primary-6);
    margin-bottom: 0.75rem;
  }
  p {
    max-width: 45em;
    margin-bottom: 1rem;
  }
  .btn {
    font-size: 0.5rem;
    padding: 0.25rem 0.5rem;
  }
  @media (min-width: 992px) {
    article {
      display: grid;
      grid-template-columns: auto 1fr;
      column-gap: 2rem;
      // align-items: center;
    }
  }
  @media (max-width: 450px) {
    .thumbnail-wrapper {
      width: 100%;
    }
  }
`;

export default SkeletonListView;
