import React, { useEffect } from "react";
import styled from "styled-components";
import {
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaGoogle,
} from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import Logo from "./images/LogoBlack.svg";
import { Link } from "react-router-dom";

const Footer = () => {


  // useEffect(()=>{
  //   window.scrollTo({ top: 0, behavior: "smooth" });

  // },[])
  return (
    <Wrapper>
      <section className="footer-section">
        <div className="container">
          <div className="footer-cta">
            <div className="single-cta">
              <i>
                <FaMapMarkerAlt />
              </i>
              <div className="cta-text">
                <h4>Find us</h4>
                <span>1010 Avenue, sw 54321, Morocco</span>
              </div>
            </div>
            <div className="single-cta">
              <i>
                <FaPhone />
              </i>
              <div className="cta-text">
                <h4>Call us</h4>
                <span>+212566884466</span>
              </div>
            </div>
            <div className="single-cta">
              <i>
                <IoMail />
              </i>
              <div className="cta-text">
                <h4>Mail us</h4>
                <span>zellijhub@info.com</span>
              </div>
            </div>
          </div>
          <div className="footer-content">
            <div className="footer-widget">
              <div className="footer-logo">
                <img src={Logo} alt="ZELLIJ Hub" />
              </div>
              <div className="footer-text">
                <p>
                  Our website specializes in selling high-quality zellige tiles,
                  known for their intricate geometric designs and vibrant
                  colors. Our target audience includes homeowners, interior
                  designers, and architects.
                </p>
              </div>
            </div>
            <div className="footer-widget">
              <div className="footer-social-icon">
                <div className="footer-widget-heading">
                  <h3>
                    <span>Follow us</span>
                  </h3>
                </div>

                <a href="#">
                  <FaFacebookF />
                </a>
                <a href="#">
                  <FaInstagram />
                </a>
                <a href="#">
                  <FaGoogle />
                </a>
              </div>
            </div>

            <div className="footer-widget">
              <div className="footer-widget-heading">
                <h3>Useful Links</h3>
              </div>
              <ul>
                <li>
                  <a href="/">Home</a>

                
                </li>
                <li>
                  <a href="/products">Products</a>
                </li>
                <li>
                  <a href="/about"> 
                  About
                  </a>
                  {/* <Link to={'about'}>
                  About
                  </Link> */}
                </li>
                <li>
                  <a href="/cart">Cart</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

const Wrapper = styled.footer`
  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .footer-section {
    // background-size: cover;
    background: #f2eee6;

    position: relative;
    // padding: 60px 0;
  }
  .container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .footer-cta {
    padding: 60px 0 30px 0;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border-bottom: 1px solid #373636;
  }

  .single-cta {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
    flex: 1 1 30%;
    max-width: 30%;
  }

  .single-cta i {
    font-size: 30px;
    color: #007f5f;
    margin-right: 15px;
  }

  .cta-text {
    padding-left: 15px;
  }

  .cta-text h4 {
    font-size: 20px;
    font-weight: 600;
    color: black;
    margin-bottom: 2px;
  }

  .cta-text span {
    font-size: 15px;
    color: #757575;
  }

  .footer-content {
    padding: 50px 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
  }

  .footer-widget {
    // flex: 1 1 30%;
    max-width: 30%;
    margin-bottom: 10px;
    align-self: flex-start;
  }

  .footer-logo {
    margin-bottom: 30px;
  }

  .footer-logo img {
    max-width: 100%;
    height: auto;
    max-height: 60px; /* Adjust the max height as needed */
  }

  .footer-text p {
    font-size: 14px;
    color: #7e7e7e;
    margin-bottom: 14px;
    line-height: 28px;
  }

  .footer-social-icon span {
    display: block;
    font-size: 20px;
    font-weight: 700;
    font-family: "Poppins", sans-serif;
    color: black;
    margin-bottom: 20px;
  }

  .footer-social-icon a {
    margin-right: 15px;
    font-size: 25px;
    color: black;
  }

  .footer-social-icon i {
    height: 40px;
    width: 40px;
    text-align: center;
    line-height: 38px;
    border-radius: 50%;
  }

  .facebook-bg {
    background: #3b5998;
  }

  .twitter-bg {
    background: #55acee;
  }

  .google-bg {
    background: #dd4b39;
  }

  .footer-widget-heading h3 {
    font-size: 20px;
    font-weight: 600;
    color: black;
    margin-bottom: 40px;
    position: relative;
  }

  .footer-widget-heading h3::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: -15px;
    height: 2px;
    width: 50px;
    background: #007f5f;
  }

  .footer-widget ul li {
    display: inline-block;
    float: left;
    width: 50%;
    margin-bottom: 12px;
  }

  .footer-widget ul li a {
    font-size: 16px;
    color: #878787;
    text-transform: capitalize;
    text-decoration: none;
  }

  .footer-widget ul li a:hover {
    color: #007f5f;
  }

  //
  .subscribe-form {
    position: relative;
    overflow: hidden;
  }
  .subscribe-form input {
    width: 100%;
    padding: 14px 28px;
    // background: #2e2e2e;
    border: 1px solid #2e2e2e;
    color: black;
  }
  .subscribe-form button {
    position: absolute;
    right: 0;
    background: #007f5f;
    padding: 13px 20px;
    border: 1px solid #007f5f;
    top: 0;
    height: 100%;
  }
  .subscribe-form button i {
    color: #fff;
    font-size: 22px;
    transform: rotate(-6deg);
  }

  .footer-menu {
    display: flex;
    justify-content: center;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .footer-menu li {
    display: inline-block;
    margin-left: 20px;
  }

  .footer-menu li a {
    font-size: 14px;
    color: #878787;
    text-decoration: none;
  }

  .footer-menu li a:hover {
    color: #ff5e14;
  }

  @media (max-width: 768px) {
    .single-cta,
    .footer-widget {
      flex: 1 1 100%;
      max-width: 100%;
    }
    .footer-cta {
      flex-direction: column;
    }
    .footer-content {
      flex-direction: column;
    }
    .footer-widget {
      margin-bottom: 30px;
    }
  }

  @media (max-width: 480px) {
    .cta-text h4 {
      font-size: 15px;
    }
    .cta-text span {
      font-size: 13px;
    }
    .footer-widget ul li {
      width: 100%;
    }
    .footer-widget ul li a {
      font-size: 12px;
    }
    .footer-widget-heading h3 {
      font-size: 15px;
    }
    .footer-text p {
      font-size: 13px;
    }
  }
`;

export default Footer;
