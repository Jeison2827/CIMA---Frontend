import React, { useState } from 'react';  
import { useDispatch, useSelector } from 'react-redux';  
import { login } from '../../redux/slices/authSlice';  
import { useNavigate } from 'react-router-dom';  
import './Login.css';  

const Login = () => {  
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');  
  const dispatch = useDispatch();  
  const navigate = useNavigate();  
  const { user, error, status } = useSelector((state) => state.auth);  

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    const result = await dispatch(login({ email, password }));  
    
    if (login.fulfilled.match(result)) {  
      console.log("Redirigiendo al dashboard...");  
      navigate('/dashboard');  
    } else {  
      console.log("Error en login:", error);  
    }  
  };  

  return (  
    <div className="login-container">  
      <form onSubmit={handleSubmit}>  
        <h2>Login</h2>  
        <input  
          type="email"  
          className="input" // Agregar la clase aquí  
          placeholder="Email"  
          value={email}  
          onChange={(e) => setEmail(e.target.value)}  
        />  
        <input  
          type="password"  
          className="input" // Agregar la clase aquí  
          placeholder="Password"  
          value={password}  
          onChange={(e) => setPassword(e.target.value)}  
        />  
        <button type="submit" disabled={status === 'loading'}>  
          {status === 'loading' ? 'Iniciando sesión...' : 'Login'}  
        </button>  
        {error && <p>{error}</p>}  
      </form>  
    </div>  
  );  
};  

export default Login;

