import styled from "styled-components";
import { FaTruck, FaCreditCard, FaPhone } from "react-icons/fa";

const HeaderContainer = styled.header`
  background-color: #404040;
  padding: 0.5rem 1rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 640px) {
    gap: 1rem;
  }
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 0.875rem; /* 14px for text-xs */
  color: white;
`;

const Header = () => {
 return (
   <HeaderContainer>
     <InfoItem>
       <FaTruck />
       <InfoText>Fast Delivery</InfoText>
     </InfoItem>
     <InfoItem>
       <FaCreditCard />
       <InfoText>Secured Payment</InfoText>
     </InfoItem>
     <InfoItem>
       <FaPhone />
       <InfoText>Call us +212-600-000000</InfoText>
     </InfoItem>
   </HeaderContainer>
 );
};

export default Header;
