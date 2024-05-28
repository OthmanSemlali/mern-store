import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/userSlice";
import "./images/style.css";
// import styled from "styled-components";
import { useEffect, useRef } from "react";
import SignupProvider from "../../Components/SignupProvider";
import { AuthWrapper } from "./StyledComponents";

// import img1 from '../login/images/bg-registration-form-1.jpg'
const schema = z.object({
  // name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(8),
});

function Login() {
  const scrollToRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/products" } }; // Default redirect path
  console.log("the user camed from ", from);
  useEffect(() => {
    // Scroll to the div when the component mounts
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const dispatch = useDispatch();
  const { isConnected, loading, custom_error } = useSelector(
    (store) => store.user
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = ({ email, password }) => {
    console.log("onsubmit", email, password);
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (isConnected) {
      navigate(from);
    }
  }, [isConnected, navigate, from]);
  return (
    <AuthWrapper
      // imageUrl={
      //   "https://img.freepik.com/premium-vector/seamless-pattern-authentic-arabian-style-vector-illustration_151170-1417.jpg?w=996"
      // }
      ref={scrollToRef}
    >
      {/* <div className="wrapper" style={{backgroundImage: 'url("./images/bg-registration-form-1.jpg")'}}> */}
      <div className="inner">
        <div className="image-holder">
          <img
            src="https://img.freepik.com/free-vector/hand-drawn-persian-carpet-pattern_23-2150305718.jpg?w=740&t=st=1714928737~exp=1714929337~hmac=3d817f2e8144db5021f7c764bcc6d42cd89fff0d5e0e935be5ee9dfa00bae81d"
            // src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/%D9%86%D8%B8%D8%B1%D8%A9_%D9%85%D9%82%D8%B1%D8%A8%D8%A9_%D9%84%D9%84%D8%B2%D9%84%D9%8A%D8%AC_%D9%81%D9%8A_%D9%85%D8%AF%D8%B1%D8%B3%D8%A9_%D8%A7%D8%A8%D9%86_%D9%8A%D9%88%D8%B3%D9%81.jpeg/330px-%D9%86%D8%B8%D8%B1%D8%A9_%D9%85%D9%82%D8%B1%D8%A8%D8%A9_%D9%84%D9%84%D8%B2%D9%84%D9%8A%D8%AC_%D9%81%D9%8A_%D9%85%D8%AF%D8%B1%D8%B3%D8%A9_%D8%A7%D8%A8%D9%86_%D9%8A%D9%88%D8%B3%D9%81.jpeg"
            alt=""
          />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <SignupProvider />

          <h5>Or Sign in With</h5> */}

          <div className="form-wrapper">
            <input
              type="text"
              placeholder="Email Address"
              className="form-control"
              {...register("email")}
            />
            {errors.email && <span>{errors.email.message}</span>}
            {custom_error && <span>{custom_error}</span>}

            {/* <i className="zmdi zmdi-email"></i> */}
          </div>

          <div className="form-wrapper">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              {...register("password")}
            />
            {errors.password && <span>{errors.password.message}</span>}

            {/* <i className="zmdi zmdi-lock"></i> */}
          </div>

          <button type="submit">
            {loading ? "login.." : "login"}
            {/* <i className="zmdi zmdi-arrow-right">h</i> */}
          </button>
          <div className="help-text">
            <spam>Don't have an account ?</spam>
            <spam>
              <b>
                <Link to="/register" style={{ color: "black" }}>
                  Register
                </Link>
              </b>
            </spam>
          </div>
        </form>
        {/* </div> */}
      </div>
    </AuthWrapper>
  );
}

export default Login;
