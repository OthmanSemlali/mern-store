import { useAuthenticationContext } from "@/context"
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
export function Authentication({children}) {
    const navigate = useNavigate()
    const [state, dispatch] = useAuthenticationContext();

    const {authenticated} = state;



useEffect(()=>{
    if (!authenticated){
        console.log('not connected');
        navigate('/auth/sign-in');
    }
},[authenticated])

console.log('connected');

    return children;
  
}

// export default AuthSuccess