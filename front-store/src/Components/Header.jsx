import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/userSlice";

const HeaderContainer = styled.header`
  background-color: #404040;
  padding: 0.5rem 1rem;
  // color: #f5f5f5;
color:white;


  //   height: 5rem;
//   display: flex;
//   align-items: center;
//   justify-content: center;


  .nav-center {

  }
`;

const AlignElement = styled.div`
  display: flex;
  justify-content: center;
  width: 90vw;
  margin: 0 auto;
  max-width: var(--max-width);

  @media (min-width: 640px) {
    justify-content: flex-end;
  }
`;

const UserInfo = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

const AuthLinkContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (min-width: 640px) {
    gap: 2rem;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #f5f5f5;
  font-size: 0.875rem; /* 14px for text-xs */
  transition: color 0.3s ease;

  &:hover {
    color: var(--text-neutral-hover);
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`

  text-transform: uppercase;
    background: transparent;
    // color: var(--clr-primary-10);
    color: var(--clr-primary-5)
    // padding: 1rem 0.75rem;
    letter-spacing: var(--spacing);
    display: inline-block;
    font-weight: 400;
    // transition: var(--transition);
    font-size: 0.875rem;
    cursor: pointer;
    // box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    border-radius: var(--radius);
    padding: 0.375rem 0.75rem;
  font-size: 0.875rem; /* 14px for text-xs */
  line-height: 1.5;
  border-radius: 0.25rem;
    border: 1px solid var(--clr-primary-5);
`;

const Header = () => {
    const dispatch = useDispatch();
    const { isConnected, user } = useSelector((store) => store.user);
  return (
    <HeaderContainer>
      <div className="nav-center">
        <AlignElement>
          {isConnected && user && user.role === "user" ? (
          <UserInfo>
            <p style={{color:"white"}}>Hello, {user.firstName}</p>
            <LogoutButton onClick={() => dispatch(logout())}>Logout</LogoutButton>
          </UserInfo>
        ) : (
          <AuthLinkContainer>
            {/* <StyledLink to="/login"> */}
            <div>

            <StyledLink to="/login">Login</StyledLink>  / <StyledLink to="/register">Create Account </StyledLink >
            </div>

            {/* </StyledLink> */}
            {/* <StyledLink to="/register">Create Account</StyledLink> */}
            {/* <StyledLink to="/sell">Sell With Us</StyledLink>   */}
          </AuthLinkContainer>
        )}
        </AlignElement>
      </div>
    </HeaderContainer>
  );
};

export default Header;
