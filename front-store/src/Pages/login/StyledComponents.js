import styled from "styled-components";

export const AuthWrapper = styled.section`
background-color: #E0DCD4;
  color: #333;
  font-size: 13px;
  margin: 0;
  min-height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  // background-image: url(${(props) => props.imageUrl});
  // background-position: right center;

  img {
    max-width: 100%;
    height: 100%;
  }

  ul {
    padding-left: 0;
    margin-bottom: 0;
  }

  a:hover {
    text-decoration: none;
  }

  :focus {
    outline: none;
  }

  .inner {
    padding: 20px;
    background: #fff;
    max-width: 850px;
    margin: auto;
    display: flex;
  }
  .inner .image-holder {
    width: 50%;
  }
  .inner form {
    width: 50%;
    padding-top: 36px;
    padding-left: 45px;
    padding-right: 45px;
    
  }
  .inner h5 {
    text-transform: uppercase;
    // font-size: 25px;
    // font-family: "Poppins-SemiBold";
    text-align: center;
    margin-bottom: 28px;
  }

  .form-group {
    display: flex;
  }
  .form-group input {
    width: 50%;
  }
  .form-group input:first-child {
    margin-right: 25px;
  }

  .form-wrapper {
    position: relative;
    margin-top: 50px;
  }
  .form-wrapper i {
    position: absolute;
    bottom: 9px;
    right: 0;
  }

  .form-control {
    border: 1px solid gainsboro;
    border-top: none;
    border-right: none;
    border-left: none;
    display: block;
    width: 100%;
    height: 30px;
    padding: 0;
    margin-bottom: 25px;
  }
  .form-control::-webkit-input-placeholder {
    font-size: 13px;
    color: gray;
    // font-family: "Poppins-Regular";
  }
  .form-control::-moz-placeholder {
    font-size: 13px;
    // color: #333;
    color: gray;
    // font-family: "Poppins-Regular";
  }
  .form-control:-ms-input-placeholder {
    font-size: 13px;
    // color: #333;
    color: gray;
    // font-family: "Poppins-Regular";
  }
  .form-control:-moz-placeholder {
    font-size: 13px;
    // color: #333;
    color: gray;
    // font-family: "Poppins-Regular";
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    padding-left: 20px;
  }
  select option[value=""][disabled] {
    display: none;
  }

  button {
    border: none;
    width: 164px;
    height: 51px;
    margin: auto;
    margin-top: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background: #629871;
    font-size: 15px;
    color: #fff;
    vertical-align: middle;
    -webkit-transform: perspective(1px) translateZ(0);
    transform: perspective(1px) translateZ(0);
    -webkit-transition-duration: 0.3s;
    transition-duration: 0.3s;
  }
  button i {
    margin-left: 10px;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
  button:hover i,
  button:focus i,
  button:active i {
    -webkit-animation-name: hvr-icon-wobble-horizontal;
    animation-name: hvr-icon-wobble-horizontal;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-timing-function: ease-in-out;
    animation-timing-function: ease-in-out;
    -webkit-animation-iteration-count: 1;
    animation-iteration-count: 1;
  }
.help-text {
  margin-top: 2em;
  text-align: center;
    font-size: 16px;


}
.help-text spam {
  text-align: center;
  margin-left: 0.4em;
}
  @media (max-width: 991px) {
    .inner form {
      padding-top: 10px;
      padding-left: 30px;
      padding-right: 30px;
    }
  }
  @media (max-width: 767px) {
    .inner {
      display: block;
    }
    .inner .image-holder {
      // width: 100%;
      display: none;
    }
    .inner form {
      width: 100%;
      padding: 40px 0 30px;
    }

    button {
      margin-top: 60px;
    }
  }
  @media (min-width: 992px) {
    // background-color: red;
    background-position: right center;

  }
  @media (min-width: 576px) {
  }

  @media (min-width: 1280px) {
  }
`;