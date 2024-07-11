import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../css/Register.css'
import '../index.css'
import axios from 'axios';

const Register = () => {

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })


  const [error,setError] = useState('');
  const navigate = useNavigate();



  const changeInputHandler = (e) =>{
    setUserData(prevState =>{
      return {...prevState, [e.target.name]: e.target.value }
    })
  }

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
        const newUser = response.data;
        console.log(newUser);

        if (!newUser) {
            setError("Something went wrong. Please try again.");
        } else {
            console.log(newUser.message);  // This should log the success message
        }
        
        navigate('/');
    } catch (error) {
        console.error("Error:", error);  // Log the full error for debugging
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
    }
};


  return (
    <section className="register" style={{marginTop:"10rem",marginBottom:"5rem"}}>
      <div className="container">
        <h2>Sign up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className="form__error-message">{error}</p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange=
          {changeInputHandler} autoFocus/>
          <input type="email" placeholder='Email' name='email' value={userData.email} onChange=
          {changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange=
          {changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onChange=
          {changeInputHandler} />
          <button type="submit" className='btn primary'>Sign up</button>
        </form>
        <small>Already have an account? <Link to='/login'>Sign in</Link></small>
      </div>
    </section>
  )
}

export default Register