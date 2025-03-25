import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Login.css';
// import '../index.css';
import axios from 'axios';
import { UserContext } from './../context/userContext.js';

const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
      const user = response.data;
      setCurrentUser(user);
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="login" style={{marginTop:"10rem",marginBottom:"5rem"}}>
      <div className="container">
        
        <form className="form login__form" onSubmit={loginUser}>
          <h2>Sign in</h2>
          {error && <p className={`form__error-message ${error ? 'verify-email-error' : ''}`}>{error}</p>}
          <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} autoFocus/>
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <button type="submit" className='btn primary'>Sign in</button>
          <small>Don't have an account? <Link to='/register'>Sign up</Link></small>
        </form>
      </div>
    </section>
  );
};

export default Login;
