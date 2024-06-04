import { useAuthenticationContext } from "@/context";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { login } from "@/context/auth/authenticationServices";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function SignIn() {
  const [state, dispatch] = useAuthenticationContext();
  const navigate = useNavigate();
  const { isLoading, error } = state;
  console.log(" auth context state", state);
  // const { sidenavType } = controller;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    const { email, password } = data;
    console.log("sign-in form data ", email, password);

    login({ email, password }, dispatch, navigate);
  };
  return (
    <section className="flex items-center justify-center gap-4">
      <div className="w-full mt-24 lg:w-3/5 ">
        <div className="text-center">
          <Typography variant="h2" className="mb-4 font-bold">
            Sign In
          </Typography>
          {/* <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</Typography> */}
        </div>
        <form
          className="max-w-screen-lg mx-auto mt-8 mb-2 w-80 lg:w-1/2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-6 mb-1">
            <div className="mb-3">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium "
              >
                Your email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                {...register("email")}
              />
              {errors.email && (
                <p className="absolute mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
              {!errors.email && error && (
                <p className="absolute mt-2 text-sm text-red-500">{error}</p>
              )}
            </div>

            <div className="mb-3">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                {...register("password")}
              />
              {errors.password && (
                <p className="absolute mt-2 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <Button className="mt-6" fullWidth type="submit">
            {isLoading ? "Sign In..." : "Sign In"}
          </Button>

        </form>
      </div>
    </section>
  );
}

export default SignIn;
