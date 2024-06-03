import { Link } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { closeSideBar } from "../features/themeSlice";
import { brand_name, links } from "../Utils/constants";
import CartButtons from "./CartButtons";
import { FaTimes } from "react-icons/fa";

import Logo from "./images/LogoBlack.svg";

const Sidebar = () => {

const dispatch = useDispatch()
const { isSideBarOpen } = useSelector(
    (store) => store.theme
  );

  console.log('isSideBarOpen', isSideBarOpen)

  const closeSideBatHundler = () => {
    dispatch(closeSideBar())
  }
  return (
    <SidebarContainer>
      <aside className={`${isSideBarOpen ? "sidebar show-sidebar" : "sidebar"}`}>
        <div className="sidebar-header">
        <img src={Logo}   height={110}
                width={110} />
          {/* <span style={{ color: 'var(--clr-primary-5)' }}>{brand_name}</span> */}
          <button className="close-btn" type="button" onClick={closeSideBatHundler}>
            <FaTimes />
            
          </button>
        </div>

        <ul className="links">
          {links.map(({ id, text, url }) => {
            return (
              <li key={id}>
                <Link to={url} onClick={closeSideBatHundler}>{text}</Link>
              </li>
            );
          })}
          <li>
            <Link to="/checkout" onClick={closeSideBatHundler}>checkout</Link>
          </li>
        </ul>

        <CartButtons closeSideBatHundler={closeSideBatHundler} />
      </aside>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  text-align: center;
  .sidebar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
  }
  .close-btn {
    font-size: 2rem;
    background: transparent;
    border-color: transparent;
    color: var(--clr-primary-5);
    transition: var(--transition);
    cursor: pointer;
    color: var(--clr-red-dark);
    margin-top: 0.2rem;
  }
  .close-btn:hover {
    color: var(--clr-red-light);
  }
  .logo {
    justify-self: center;
    height: 45px;
  }
  .links {
    margin-bottom: 2rem;
  }
  .links a {
    display: block;
    text-align: left;
    font-size: 1rem;
    text-transform: capitalize;
    padding: 1rem 1.5rem;
    color: var(--clr-grey-3);
    transition: var(--transition);
    letter-spacing: var(--spacing);
  }

  .links a:hover {
    padding: 1rem 1.5rem;
    padding-left: 2rem;
    background: var(--clr-grey-10);
    color: var(--clr-grey-2);
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--clr-white);
    transition: var(--transition);
    transform: translate(-100%);
    z-index: -1;
  }
  .show-sidebar {
    transform: translate(0);
    z-index: 999;
  }
  .cart-btn-wrapper {
    margin: 2rem auto;
  }
  @media screen and (min-width: 992px) {
    .sidebar {
      display: none;
    }
  }
`;

export default Sidebar;
