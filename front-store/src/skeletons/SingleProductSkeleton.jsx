import React from 'react'
import styled from 'styled-components';
import SkeletonElement from './SkeletonElement';
export function SingleProductSkeleton() {
  return (
    <div className="product-center">
            {/* Images */}
            <SkeletonImagesWrapper>
              <div className="thumbnail-wrapper main">
                {/* image place */}
                <SkeletonElement type="thumbnail" />
              </div>

              <div className="gallery">
                {[0, 1, 2, 3, 4].map((n) => {
                  return (
                    <div className="thumbnail-wrapper">
                      <SkeletonElement type="thumbnail" key={n} />
                    </div>
                  );
                })}
              </div>
            </SkeletonImagesWrapper>

            <section className="content">
              <SkeletonElement type="text" />

              <SkeletonElement type="short-title" />
              <br></br>
              <SkeletonElement type="long-text" />
              <SkeletonElement type="long-text" />
              <SkeletonElement type="short-text" />
            </section>
          </div>
  )
}


const SkeletonImagesWrapper = styled.section`
  // media:Moyene
  .main {
    height: 400px;
  }
  .thumbnail-wrapper {
    width: 100%;
    // display: block;
    border-radius: var(--radius);

    // animation: skeleton-show-hide 2s infinite;
  }
  .gallery {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 1rem;
    // .thumbnail-wrapper {
    //   height: 80px;
    //   cursor: pointer;
    // }
  }
  .active {
    box-shadow: 0px 0px 0px 2px var(--clr-primary-5);
  }
  @media (max-width: 690px) {
    .main {
      height: 300px;
    }
    // .gallery {
    //   .thumbnail-wrapper {
    //     height: 50px;
    //   }
    // }
  }
  @media (min-width: 992px) {
    .main {
      height: 400px;
      // height: 500px;
    }
    // .gallery {
    //   .thumbnail-wrapper {
    //     height: 75px;
    //   }
    // }
  }

  // @keyframes skeleton-show-hide {
  //   0% {
  //     opacity: 1;
  //   }
  //   50% {
  //     opacity: 0.5;
  //   }
  //   100% {
  //     opacity: 1;
    
  //   }
  // }
`;

export default SingleProductSkeleton