import { Link } from "react-router-dom";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { register as registerUser } from "../features/userSlice";


const schema = z.object({
  // name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(8),
  // role: z.string().includes('user', 'admin', 'seller')
});
function Register() {

  const dispatch = useDispatch()
  const {loading, error} = useSelector((store) => store.user)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = ({ email, password }) => {

    console.log('onsubmit register', email, password);
    dispatch(registerUser({email, password, role: 'user'}))

  };
  return (
    <div>
      <form  onSubmit={handleSubmit(onSubmit)}>
      <input type='text' placeholder='email' {...register("email")} />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <br />

      <input type='password' placeholder='password' {...register("password")}/>
      {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}
      <br />

      <button type="submit">{loading ? 'register..' : 'register'}</button>
      <br />

      </form>
      <Link to={'/login'}><u>login</u></Link>
    </div>
  )
}

export default Register