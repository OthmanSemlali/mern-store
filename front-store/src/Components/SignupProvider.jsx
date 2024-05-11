import { FacebookIcon, GoogleIcon } from "./Icon";

const SignupProvider = () => {
  return (
    <div className='signup-provider'>
      <a href={`API_URL/auth/google`} className='google-btn'>
        <GoogleIcon />
        <span className='btn-text'>Login with Google</span>
      </a>

      {/* <a href={`API_URL/auth/facebook`} className='facebook-btn'>
        <FacebookIcon />
        <span className='btn-text'>Login with Facebook</span>
      </a> */}
    </div>
  );

}

export default SignupProvider