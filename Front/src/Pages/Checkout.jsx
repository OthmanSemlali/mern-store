import React from 'react'
import styled from 'styled-components'

// extra imports
import { Link } from 'react-router-dom'
import { PageHero } from '../Components'

const CheckoutPage = () => {
  return <main>
    <PageHero title='checkout' />
    <Wrapper className='page'></Wrapper>
  </main>
}
const Wrapper = styled.div``
export default CheckoutPage
