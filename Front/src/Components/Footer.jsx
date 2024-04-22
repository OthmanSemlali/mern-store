import React from 'react'
import styled from 'styled-components'
import { brand_name } from '../Utils/constants'
const Footer = () => {
  return <Wrapper>
    <h5>
      &copy; {new Date().getFullYear()}
      <span> {brand_name} </span>
    </h5>
    <h5>All rights reserved</h5>
  </Wrapper>
}

const Wrapper = styled.footer`

  height: 10rem;
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--clr-white);
  text-align: center;
  span {
    color: var(--clr-primary-5);
  }
  h5 {
    color: var(--clr-black);
    margin: 0.1rem;

    font-weight: 400;
    text-transform: none;
    line-height: 1.25;
  }
  @media (min-width: 776px) {
    flex-direction: row;
  }
`

export default Footer
