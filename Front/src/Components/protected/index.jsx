import { useEffect } from "react";
import { useSelector } from "react-redux";
// import { Login } from "../../Pages";
import { useNavigate } from "react-router-dom";

function Protected({ children }) {
  const { isConnected } = useSelector((store) => store.user);
const navigate = useNavigate()
useEffect(()=>{
    if (!isConnected) {
        navigate('/login')
      }
}, [])
  return  children ;
}

export default Protected;
