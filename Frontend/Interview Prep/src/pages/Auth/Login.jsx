import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
const Login = ({setCurrentPage}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // handle login form submit
    const handleLogin = async (e) => {
        e.preventDefault();
    };
  return (<div>Login</div>)
}

export default Login