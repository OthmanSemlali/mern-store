import { Link } from "react-router-dom";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/userSlice";

const schema = z.object({
  // name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(8),
});
function Login() {

  const dispatch = useDispatch()
  const {loading, custom_error} = useSelector((store) => store.user)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = ({ email, password }) => {

    console.log('onsubmit', email, password);
    dispatch(login({email, password}))

  };
  return (
    <div>
      
      {custom_error ? <p>{custom_error}</p> : null}
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="email" 
        {...register("email")}
        />

        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <br />
        <input type="password" placeholder="password"
        {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <br />
        <button type="submit">{loading ? 'login..' : 'login'}</button>

        <br />
      </form>

      <Link to={"/register"}>
        <u>register</u>
      </Link>
    </div>
  );
}

export default Login;
