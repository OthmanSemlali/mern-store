import React, { useEffect, useState } from "react";
import styled from "styled-components";

const ProductImages = ({image, images }) => {
  console.log('images[0] ',images[0]);
  console.log('images[0] ',image);

  const [main, setMain] = useState(image)
  
  useEffect(() => {
    if (images.length > 0) {
      setMain(images[0]);
    }
  }, [images]);
  console.log('main',main);
  return (
    <Wrapper>
      <img src={main} alt='main img' className="main" />

      <div className="gallery" >
        {
           images.map((image,index)=>{
            return <img src={image} alt='' key={index}  onClick={()=>setMain(images[index])} className={`${image === main ? 'active': null}`} />
          })
        }

      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
// media:Moyene
  .main {
    height: 400px;
  }
  img {
    width: 100%;
    // display: block;
    border-radius: var(--radius);
    object-fit: cover;
  }
  .gallery {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    column-gap: 1rem;
    img {
      height: 80px;
      cursor: pointer;
    }
  }
  .active {
    box-shadow: 0px 0px 0px 2px var(--clr-primary-5);
  }
  @media (max-width: 690px) {
    .main {
      height: 300px;
    }
    .gallery {
      img {
        height: 50px;
      }
    }
  }
  @media (min-width: 992px) {
    .main {
      height: 400px;
      // height: 500px;
    }
    .gallery {
      img {
        height: 75px;
      }
    }
  }
`;

export default ProductImages;
