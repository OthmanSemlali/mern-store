import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  useStripe,
  Elements,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
// import { formatPrice } from '../utils/helpers';
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../Utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../features/cartSlice";
import { logout } from "../features/userSlice";

const promise = loadStripe(
  "pk_test_51PGJAkFLtCZ2m8NtXVSH6HZjlEZKMxp98OQYtYm7mh28gkTQFQ3ZTTyM5KZ1vmtCQfzlgvzHBTslfGuT0D47GWok00yXL0Xprr"
);

const CheckoutForm = () => {
  const {
    cart,
    total_amount,
    shipping_fee = 5,
  } = useSelector((store) => store.cart);
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  //   create order

  const createOrder = async () => {
    const shipping = {
      name: "John Doe", // Customer's name for delivery
      address: {
        line1: "123 Main St", // Customer's street address
        city: "Anytown", // Customer's city
        // state: 'CA', // Customer's state
        // postal_code: '12345', // Customer's postal code
        country: "US", // Customer's country code
      },
    };

    try {
      const response = await fetch("http://localhost:3000/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ cart, shipping_fee, total_amount, shipping }),
      });

      if (response.ok) {
        console.log("order created");
      } else {
        const errDetails = await response.json();
        console.log("error create orderrr ", errDetails);
      }
    } catch (error) {
      console.log("error create order ", error.response);
      throw Error(error.response);
    }
  };
  // create payment
  const createPaymentIntent = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/create-payment-intent",

        { cart, shipping_fee, total_amount }
      );
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.log("error create payment intent ", error.response);
    }
  };
  useEffect(() => {
    createPaymentIntent();
    // eslint-disable-next-line
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: "Arial, sans-serif",
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d",
        },
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };
  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setProcessing(true);
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (payload.error) {
      // console.log('payload', payload)
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      try {
        await createOrder();
        setError(null);
        setProcessing(false);
        setSucceeded(true);

        setTimeout(() => {
          dispatch(clearCart());
          navigate("/cart");
        }, 3000);
      } catch (error) {
        setProcessing(false);

        alert("SERVER LOGIN! PLEASAE LOGIN AGAIN");
        dispatch(logout());
        navigate("/login");

        // alert(error.message)
        // setError(`Payment failed ${error.message}`);
        console.log("errorrtrt", error);
      }

      //   PLACE ORDER
    }
  };
  return (
    <div>
      {succeeded ? (
        <article>
          <h4>Thank you</h4>
          <h4>Your payment was successful!</h4>
          <h4>Redirecting to home page shortly</h4>
        </article>
      ) : (
        <>
          <article>
            <h4>Hello, {user && user.firstName}</h4>
            <p>Your total is {formatPrice(total_amount)}</p>
            <p>Test Card Number: 4242 4242 4242 4242</p>
          </article>

          <form id="payment-form" onSubmit={handleSubmit}>
            <CardElement
              id="card-element"
              options={cardStyle}
              onChange={handleChange}
            />
            <button disabled={processing || disabled || succeeded} id="submit">
              <span id="button-text">
                {processing ? (
                  <div className="spinner" id="spinner"></div>
                ) : (
                  "Pay"
                )}
              </span>
            </button>
            {/* Show any error that happens when processing the payment */}
            {error && (
              <div className="card-error" role="alert">
                {error}
              </div>
            )}
            {/* Show a success message upon completion */}
            {/* <p
              className={succeeded ? "result-message" : "result-message hidden"}
            >
              Payment succeeded
            </p> */}
          </form>
        </>
      )}
    </div>
  );
};

const StripeCheckout = () => {
  return (
    <Wrapper>
      <Elements stripe={promise}>
        <CheckoutForm />
      </Elements>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  form {
    width: 30vw;
    align-self: center;
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
  }
  input {
    border-radius: 6px;
    margin-bottom: 6px;
    padding: 12px;
    border: 1px solid rgba(50, 50, 93, 0.1);
    max-height: 44px;
    font-size: 16px;
    width: 100%;
    background: white;
    box-sizing: border-box;
  }
  .result-message {
    line-height: 22px;
    font-size: 16px;
  }
  .result-message a {
    color: rgb(89, 111, 214);
    font-weight: 600;
    text-decoration: none;
  }
  .hidden {
    display: none;
  }
  #card-error {
    color: rgb(105, 115, 134);
    font-size: 16px;
    line-height: 20px;
    margin-top: 12px;
    text-align: center;
  }
  #card-element {
    border-radius: 4px 4px 0 0;
    padding: 12px;
    border: 1px solid rgba(50, 50, 93, 0.1);
    max-height: 44px;
    width: 100%;
    background: white;
    box-sizing: border-box;
  }
  #payment-request-button {
    margin-bottom: 32px;
  }
  /* Buttons and links */
  button {
    background: #5469d4;
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 0 0 4px 4px;
    border: 0;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
  }
  button:hover {
    filter: contrast(115%);
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  /* spinner/processing state, errors */
  .spinner,
  .spinner:before,
  .spinner:after {
    border-radius: 50%;
  }
  .spinner {
    color: #ffffff;
    font-size: 22px;
    text-indent: -99999px;
    margin: 0px auto;
    position: relative;
    width: 20px;
    height: 20px;
    box-shadow: inset 0 0 0 2px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  .spinner:before,
  .spinner:after {
    position: absolute;
    content: "";
  }
  .spinner:before {
    width: 10.4px;
    height: 20.4px;
    background: #5469d4;
    border-radius: 20.4px 0 0 20.4px;
    top: -0.2px;
    left: -0.2px;
    -webkit-transform-origin: 10.4px 10.2px;
    transform-origin: 10.4px 10.2px;
    -webkit-animation: loading 2s infinite ease 1.5s;
    animation: loading 2s infinite ease 1.5s;
  }
  .spinner:after {
    width: 10.4px;
    height: 10.2px;
    background: #5469d4;
    border-radius: 0 10.2px 10.2px 0;
    top: -0.1px;
    left: 10.2px;
    -webkit-transform-origin: 0px 10.2px;
    transform-origin: 0px 10.2px;
    -webkit-animation: loading 2s infinite ease;
    animation: loading 2s infinite ease;
  }
  @keyframes loading {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @media only screen and (max-width: 600px) {
    form {
      width: 80vw;
    }
  }
`;

export default StripeCheckout;
