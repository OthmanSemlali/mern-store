import styled from "styled-components";
// import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import { brand_name, links } from "../Utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { openSideBar } from "../features/themeSlice";
import { FaBars } from "react-icons/fa";
import CartButtons from "./CartButtons";
import Logo from "./images/LogoBlack.svg";
const Nav = () => {
  const dispatch = useDispatch();
  return (
    <NavContainer>
      <div className="nav-center">
        <div className="nav-header">
          <img src={Logo}   height={110}
                width={110} />
          
          <button
            type="button"
            className="nav-toggle"
            onClick={() => dispatch(openSideBar())}
          >
            {/* OPEN */}
            <FaBars />
          </button>
        </div>

        <ul className="nav-links">
          {links.map((link) => {
            const { id, text, url } = link;
            return (
              <li key={id}>
                <Link to={url}>{text}</Link>
              </li>
            );
          })}
        </ul>

        <CartButtons />
      </div>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .nav-center {
    width: 90vw;
    margin: 0 auto;
    max-width: var(--max-width);
  }
  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .nav-header img {
    max-width: 100%;
    height: auto;
    max-height: 50px; /* Adjust the max height as needed */
  }
  .nav-toggle {
    background: transparent;
    border: transparent;
    color: var(--clr-primary-5);
    cursor: pointer;
    svg {
      font-size: 2rem;
    }
  }
  .nav-links {
    display: none;
  }
  .cart-btn-wrapper {
    display: none;
  }
  @media (min-width: 992px) {
    .nav-toggle {
      display: none;
    }
    .nav-center {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
    }
    .nav-links {
      display: flex;
      justify-content: center;
      li {
        margin: 0 0.5rem;
      }
      a {
        color: var(--clr-grey-3);
        font-size: 1rem;
        text-transform: capitalize;
        letter-spacing: var(--spacing);
        padding: 0.5rem;
        &:hover {
          border-bottom: 2px solid var(--clr-primary-7);
        }
      }
    }
    .cart-btn-wrapper {
      display: grid;
    }
  }
`;

export default Nav;
