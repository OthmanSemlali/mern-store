import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../features/userSlice";
import { AuthWrapper } from "./login/StyledComponents";
import { useEffect, useRef } from "react";
import SignupProvider from "../Components/SignupProvider";

const schema = z.object({
  // name: z.string().min(1, { message: "Name is required" }),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  // role: z.string().includes('user', 'admin', 'seller')
});
function Register() {
  const scrollToRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    // Scroll to the div when the component mounts
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((store) => store.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit =  ({ firstName, lastName, email, password }) => {
    console.log("onsubmit register", email, password);
    dispatch(
      registerUser({ firstName, lastName, email, password, role: "user" })
    );

   
  };
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

          <h5>Or Sign Up With</h5> */}
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              className="form-control"
              {...register("firstName")}
            />
            {errors.firstName && <span>{errors.firstName.message}</span>}

            <input
              type="text"
              placeholder="Last Name"
              className="form-control"
              {...register("lastName")}
            />
            {errors.lastName && <span>{errors.lastName.message}</span>}
          </div>

          <div className="form-wrapper">
            <input
              type="text"
              placeholder="Email Address"
              className="form-control"
              {...register("email")}
            />
            {errors.email && <span>{errors.email.message}</span>}
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
            {loading ? "register.." : "register"}

            {/* <i className="zmdi zmdi-arrow-right">h</i> */}
          </button>
          <div className="help-text">
            <spam>Already have an account ?</spam>
            <spam>
              <b>
                <Link to="/login" style={{ color: "black" }}>
                  Log In
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

export default Register;
