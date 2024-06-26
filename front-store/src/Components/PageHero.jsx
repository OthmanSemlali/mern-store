import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
const PageHero = ({title,product}) => {

  return <Wrapper>
    <div className='section-center'>
      <h4>
        <Link to='/'>Home</Link>
        {product && <Link to='/products'>/Products</Link>}
        
        /{title}
      </h4>
    </div>
  </Wrapper>
}

const Wrapper = styled.section`
  background: #e0dcd4;
  width: 100%;
  min-height: 10vh;
  height: 10vh;
  display: flex;
  align-items: center;

  color: var(--clr-primary-1);
  a {
    color: var(--clr-primary-5);
    padding: 0.5rem;
    transition: var(--transition);
  }
  a:hover {
    color: var(--clr-primary-1);
  }
`;

export default PageHero
